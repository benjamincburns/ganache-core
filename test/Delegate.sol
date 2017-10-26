pragma solidity ^0.4.8;

contract Doubler {
  int32 temp;

  function double(int32 n) public returns(int32) {
    // Setting the temp variable rather than returning directly is to demonstrate that mutating 
    // state is not the problem. eth_call works correctly with this function.
    temp = n * 2;
    return temp;
  }
}

contract Delegator {
  function doubleWithTempContract(int32 n) public returns(int32) {
    Doubler doubler = new Doubler();
    return doubler.double(n);
  } 
}
