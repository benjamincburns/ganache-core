var Web3 = require('web3');
var Transaction = require('ethereumjs-tx');
var utils = require('ethereumjs-util');
var assert = require('assert');
var TestRPC = require("../index.js");
var solc = require("solc");
var fs = require("fs");
var to = require("../lib/utils/to");
var clone = require("clone");

// Thanks solc. At least this works!
// This removes solc's overzealous uncaughtException event handler.
process.removeAllListeners("uncaughtException");

var tests = function(web3) {
  var testContext = {};

  before(function (done) {
    testContext.source = fs.readFileSync("./test/Delegate.sol", {encoding: "utf8"});
    testContext.solcResult = solc.compile(testContext.source, false);

    // Note: Certain properties of the following contract data are hardcoded to
    // maintain repeatable tests. If you significantly change the solidity code,
    // make sure to update the resulting contract data with the correct values.
    testContext.delegateContract = {
      solidity: testContext.source,
      abi: testContext.solcResult.contracts[":Delegator"].interface,
      binary: "0x" + testContext.solcResult.contracts[":Delegator"].bytecode,
      runtimeBinary: '0x' + testContext.solcResult.contracts[":Delegator"].runtimeBytecode
    };

    /*testContext.delegateContract = {
      solidity: testContext.source,
      abi: testContext.solcResult.contracts["Delegator"].interface,
      binary: "0x" + testContext.solcResult.contracts["Delegator"].bytecode,
      runtimeBinary: '0x' + testContext.solcResult.contracts["Delegator"].runtimeBytecode
    };*/

    web3.eth.getAccounts(function(err, accs) {
      if (err) return done(err);

      testContext.accounts = accs;

      web3.personal.newAccount("password", function(err, result) {
        testContext.personalAccount = result;
        done();
      });
    });
  });

  describe("contract deployment", function() {
    it("should be able to call a temporary contract", function(done) {
      var delegateCode = testContext.delegateContract.binary;
      var delegateAbi = JSON.parse(testContext.delegateContract.abi);

      var DelegateContract = web3.eth.contract(delegateAbi);
      DelegateContract._code = delegateCode;
      DelegateContract.new({ data: delegateCode, from: testContext.accounts[0], gas: 3141592 }, function (err, instance) {
        if (err) {
          return done(err);
        }

        var testCall = function(instance) {
          instance.doubleWithTempContract.estimateGas(3, { gas: 3141592 }, function(err, estimateResult) {
            instance.doubleWithTempContract.call(3, { gas: estimateResult }, function(err, result) {
              if (err) {
                return done(err);
              }

              assert.equal(result, 6);
              done();
            });
          });
        }

        if (!instance.address) {
          web3.eth.getTransactionReceipt(instance.transactionHash, function(err, receipt) {
            if (err) {
              return done(err);
            }

            assert.notEqual(receipt, null, "Transaction receipt shouldn't be null");
            assert.notEqual(receipt.contractAddress, null, "Transaction did not create a contract");
            testCall(DelegateContract.at(receipt.contractAddress));
          });
        } else {
          testCall(instance);
        }

      });
    });
  });
}

var logger = {
  log: function(message) {
    //console.log(message);
  }
};

describe("Provider:", function() {
  var web3 = new Web3();
  web3.setProvider(TestRPC.provider({
    logger: logger,
    seed: "1337"
  }));
  tests(web3);
});

describe("Server:", function(done) {
  var web3 = new Web3();
  var port = 12345;
  var server;

  before("Initialize TestRPC server", function(done) {
    server = TestRPC.server({
      logger: logger,
      seed: "1337"
    });
    server.listen(port, function(err) {
      web3.setProvider(new Web3.providers.HttpProvider("http://localhost:" + port));
      done();
    });
  });

  after("Shutdown server", function(done) {
    server.close(done);
  });

  tests(web3);
});
