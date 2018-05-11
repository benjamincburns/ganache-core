export default class EthRpcMiddleware {
  // TODO: constructor

  eth_accounts(callback) {
    callback(null, Object.keys(this.state.accounts))
  }

  eth_blockNumber(callback) {
    this.state.blockNumber(function(err, result) {
      if (err) return callback(err)
      callback(null, to.hex(result))
    })
  }

  eth_coinbase(callback) {
    callback(null, this.state.coinbase)
  }

  eth_mining(callback) {
    callback(null, this.state.is_mining)
  }

  eth_hashrate(callback) {
    callback(null, '0x0')
  }

  eth_gasPrice(callback) {
    callback(null, utils.addHexPrefix(this.state.gasPrice()))
  }

  eth_getBalance(address, block_number, callback) {
    this.state.getBalance(address, block_number, callback)
  }

  eth_getCode(address, block_number, callback) {
    this.state.getCode(address, block_number, callback)
  }

  eth_getBlockByNumber(block_number, include_full_transactions, callback) {
    this.state.blockchain.getBlock(block_number, function(err, block) {
      if (err) {
        if (err.message && err.message.indexOf("index out of range") >= 0) {
          return callback(null, null)
        } else {
          return callback(err)
        }
      }

      callback(null, blockHelper.toJSON(block, include_full_transactions))
    })
  }

  eth_getBlockByHash(tx_hash, include_full_transactions, callback) {
    this.eth_getBlockByNumber.apply(this, arguments)
  }

  eth_getBlockTransactionCountByNumber(block_number, callback) {
    this.state.blockchain.getBlock(block_number, function(err, block) {
      if (err) {
        if (err.message.indexOf("index out of range")) {
          // block doesn't exist
          return callback(null, 0)
        } else {
          return callback(err)
        }
      }
      callback(null, block.transactions.length)
    })
  }

  eth_getBlockTransactionCountByHash(block_hash, callback) {
    this.eth_getBlockTransactionCountByNumber.apply(this, arguments)
  }

  eth_getTransactionReceipt(hash, callback) {
    this.state.getTransactionReceipt(hash, function(err, receipt) {
      if (err) return callback(err)

      var result = null

      if (receipt){
        result = receipt.toJSON()
      }
      callback(null, result)
    })
  }

  eth_getTransactionByHash(hash, callback) {
    this.state.getTransactionReceipt(hash, function(err, receipt) {
      if (err) return callback(err)

      var result = null

      if (receipt) {
        result = txhelper.toJSON(receipt.tx, receipt.block)
      }

      callback(null, result)
    })
  }

  eth_getTransactionByBlockHashAndIndex(hash_or_number, index, callback) {
    var self = this

    index = to.number(index)

    this.state.getBlock(hash_or_number, function(err, block) {
      if (err) {
        // block doesn't exist by that hash
        if (err.notFound) {
          return callback(null, null)
        } else {
          return callback(err)
        }
      }

      if (index >= block.transactions.length) {
        return callback(new Error("Transaction at index " + to.hex(index) + " does not exist in block."))
      }

      var tx = block.transactions[index]
      var result = txhelper.toJSON(tx, block)

      callback(null, result)
    })
  }

  eth_getTransactionByBlockNumberAndIndex(hash_or_number, index, callback) {
    this.eth_getTransactionByBlockHashAndIndex(hash_or_number, index, callback)
  }

  eth_getTransactionCount(address, block_number, callback) {
    this.state.getTransactionCount(address, block_number, callback)
  }

  eth_sign(address, dataToSign, callback) {
    var result
    var error

    try {
      result = this.state.sign(address, dataToSign)
    } catch (e) {
      error = e
    }

    callback(error, result)
  }

  eth_sendTransaction(tx_data, callback) {
    this.state.queueTransaction("eth_sendTransaction", tx_data, null, callback)
  }

  eth_sendRawTransaction(rawTx, callback) {
    this.state.queueRawTransaction(rawTx, callback)
  }

  eth_call(tx_data, block_number, callback) {
    if (!tx_data.gas) {
      tx_data.gas = this.state.blockchain.blockGasLimit
    }

    this.state.queueTransaction("eth_call", tx_data, block_number, callback) // :(
  }

  eth_estimateGas(tx_data, block_number, callback) {
    if (!tx_data.gas) {
      tx_data.gas = this.state.blockchain.blockGasLimit
    }
    this.state.queueTransaction("eth_estimateGas", tx_data, block_number, callback)
  }

  eth_getStorageAt(address, position, block_number, callback) {
    this.state.queueStorage(address, position, block_number, callback)
  }

  eth_newBlockFilter(callback) {
    var filter_id = utils.addHexPrefix(utils.intToHex(this.state.latest_filter_id))
    this.state.latest_filter_id += 1
    callback(null, filter_id)
  }

  eth_getFilterChanges(filter_id, callback) {
    var blockHash = this.state.latestBlock().hash().toString("hex")
    // Mine a block after each request to getFilterChanges so block filters work.
    this.state.mine()
    callback(null, [blockHash])
  }

  eth_getLogs(filter, callback) {
    this.state.getLogs(filter, callback)
  }

  eth_uninstallFilter(filter_id, callback) {
    callback(null, true)
  }

  eth_protocolVersion(callback) {
    callback(null, "63")
  }

  bzz_hive(callback) {
    callback(null, [])
  }

  bzz_info(callback) {
    callback(null, [])
  }

  shh_version(callback) {
    callback(null, "2")
  }

  eth_getCompilers(callback) {
    callback(null, ["solidity"])
  }

  eth_syncing(callback) {
    callback(null, false)
  }
}
