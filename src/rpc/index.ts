var utils = require('ethereumjs-util');
var StateManager = require('../statemanager.js');
var to = require('../utils/to');
var txhelper = require('../utils/txhelper');
var blockHelper = require('../utils/block_helper');
var pkg = require('../../package.json');
var _ = require('lodash');

const Subprovider = require('web3-provider-engine/subproviders/subprovider.js');

export default class GethApiDouble extends Subprovider {
  constructor (options: any, provider: IProvider) {
    var self = this;

    this.state = options.state || new StateManager(options, provider);
    this.options = options;
    this.initialized = false;

    this.initialization_error = null;
    this.post_initialization_callbacks = [];

    this.state.initialize(function(err) {
      if (err) {
        self.initialization_error = err;
      }
      self.initialized = true;

      var callbacks = self.post_initialization_callbacks;
      self.post_initialization_callbacks = [];

      callbacks.forEach(function(callback) {
        setImmediate(function() {
          callback();
        });
      });
    });
  }

  waitForInitialization(callback) {
    var self = this;
    if (self.initialized == false) {
      self.post_initialization_callbacks.push(callback);
    } else {
      callback(self.initialization_error, self.state);
    }
  }

  // Function to not pass methods through until initialization is finished
  handleRequest(payload, next, end) {
    var self = this;

    if (self.initialization_error != null) {
      return end(self.initialization_error);
    }

    if (self.initialized == false) {
      self.waitForInitialization(self.getDelayedHandler(payload, next, end));
      return;
    }

    var method = self[payload.method];

    if (method == null) {
      return end(new Error("Method " + payload.method + " not supported."));
    }

    var params = payload.params || [];
    var args = [].concat(params);

    var addedBlockParam = false;

    if (self.requiresDefaultBlockParameter(payload.method) && args.length < method.length - 1) {
      args.push("latest");
      addedBlockParam = true;
    }

    args.push(end);

    // avoid crash by checking to make sure that we haven't specified too many arguments
    if (
      args.length > method.length
      || (method.minLength !== undefined && args.length < method.minLength)
      || (method.minLength === undefined && args.length < method.length)
    ){

      var errorMessage = `Incorrect number of arguments. Method '${payload.method}' requires `;
      if (method.minLength) {
        errorMessage += `between ${method.minLength - 1} and ${method.length - 1} arguments. `;
      } else {
        errorMessage += `exactly ${method.length - 1} arguments. `;
      }

      if (addedBlockParam) {
        errorMessage += 'Including the implicit block argument, r';
      } else {
        // new sentence, capitalize it.
        errorMessage += 'R';
      }
      errorMessage += `equest specified ${args.length - 1} arguments: ${JSON.stringify(args)}.`

      return end(new Error(errorMessage));
    }

    method.apply(self, args);
  };

  getDelayedHandler(payload, next, end) {
    var self = this;
    return function(err, state) {
      if (err) {
        end(err);
      }
      self.handleRequest(payload, next, end);
    }
  }

  requiresDefaultBlockParameter(method) {
    // object for O(1) lookup.
    var methods = {
      "eth_getBalance": true,
      "eth_getCode": true,
      "eth_getTransactionCount": true,
      "eth_getStorageAt": true,
      "eth_call": true,
      "eth_estimateGas": true
    };

    return methods[method] === true;
  };

  net_listening(callback) {
    callback(null, true);
  };

  net_peerCount(callback) {
    callback(null, 0);
  };

  web3_clientVersion(callback) {
    callback(null, "EthereumJS TestRPC/v" + pkg.version + "/ethereum-js")
  };

  web3_sha3(string, callback) {
    callback(null, to.hex(utils.sha3(string)));
  };

  net_version(callback) {
    // net_version returns a string containing a base 10 integer.
    callback(null, this.state.net_version + "");
  };

  miner_start(threads, callback) {
    if (!callback && typeof threads === 'function') {
      callback = threads;
      threads = null;
    }

    this.state.startMining(function(err) {
      callback(err, true);
    });
  };

  miner_stop(callback) {
    this.state.stopMining(function(err) {
      callback(err, true);
    });
  };

  rpc_modules(callback) {
    // returns the availible api modules and versions
    callback(null, {"eth":"1.0","net":"1.0","rpc":"1.0","web3":"1.0","evm":"1.0","personal":"1.0"});
  };

  personal_listAccounts(callback) {
    callback(null, Object.keys(this.state.personal_accounts));
  };

  personal_newAccount(password, callback) {
    var account = this.state.createAccount({ generate: true });
    this.state.accounts[account.address.toLowerCase()] = account;
    this.state.personal_accounts[account.address.toLowerCase()] = true;
    this.state.account_passwords[account.address.toLowerCase()] = password;
    callback(null, account.address);
  };

  personal_importRawKey(rawKey, password, callback) {
    var account = this.state.createAccount({ secretKey: rawKey });
    this.state.accounts[account.address.toLowerCase()] = account;
    this.state.personal_accounts[account.address.toLowerCase()] = true;
    this.state.account_passwords[account.address.toLowerCase()] = password;
    callback(null, account.address);
  };

  personal_lockAccount(address, callback) {
    var account = this.state.personal_accounts[address.toLowerCase()];
    if (account !== true) {
      return callback("Account not found");
    }
    delete this.state.unlocked_accounts[address.toLowerCase()];
    callback(null, true);
  };

  personal_unlockAccount(address, password, duration, callback) {
    // FIXME handle duration
    var account = this.state.personal_accounts[address.toLowerCase()];
    if (account !== true) {
      return callback("Account not found");
    }

    var storedPassword = this.state.account_passwords[address.toLowerCase()];
    if (storedPassword !== undefined && storedPassword !== password) {
      return callback("Invalid password")
    }

    this.state.unlocked_accounts[address.toLowerCase()] = true;
    callback(null, true);
  };

  personal_sendTransaction(tx_data, password, callback) {
    if (tx_data.from == null) {
      callback("Sender not found");
      return;
    }

    var from = utils.addHexPrefix(tx_data.from).toLowerCase();

    var self = this;
    self.personal_unlockAccount(from, password, null, function(err) {
      if (err) return callback(err);

      self.state.queueTransaction("eth_sendTransaction", tx_data, null, function(err, ret) {
        self.state.unlocked_accounts[from.toLowerCase()] = false;
        callback(err, ret);
      });
    });
  };


  debug_traceTransaction(tx_hash, params, callback) {
    if (typeof params == "function") {
      callback = params;
      params = [];
    }

    this.state.queueTransactionTrace(tx_hash, params, callback);
  };
}

// indicate that `miner_start` only requires one argument (the callback)
GethApiDouble.prototype.miner_start.minLength = 1;
