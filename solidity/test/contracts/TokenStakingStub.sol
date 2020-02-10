pragma solidity ^0.5.4;

import "@keep-network/sortition-pools/contracts/api/IStaking.sol";

/// @title Token Staking Stub
/// @dev This contract is for testing purposes only.
contract TokenStakingStub is IStaking {
    uint256 balance = 1;

    /// @dev Sets balance variable value.
    function setBalance(uint256 _balance) public {
        balance = _balance;
    }

    /// @dev Returns balance variable value.
    function eligibleStake(address _address, address)
        public
        view
        returns (uint256)
    {
        return balance;
    }
}
