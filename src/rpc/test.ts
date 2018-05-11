export default class TestRpcMiddleware {
  // TODO: constructor

  /* Functions for testing purposes only. */
  evm_snapshot(callback) {
    this.state.snapshot(callback)
  }

  evm_revert(snapshot_id, callback) {
    this.state.revert(snapshot_id, callback)
  }

  evm_increaseTime(seconds, callback) {
    callback(null, this.state.blockchain.increaseTime(seconds))
  }

  evm_mine(callback) {
    this.state.processBlocks(1, function(err) {
      callback(err, '0x0')
    })
  }
}
