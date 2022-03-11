pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";


contract HashaGold is ERC20PresetMinterPauser {

    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");


    constructor(uint256 initialSupply) ERC20PresetMinterPauser("Hasha Gold", "HSHG") {
        // Mint 100 tokens to msg.sender
        // Similar to how
        // 1 dollar = 100 cents
        // 1 token = 1 * (10 ** decimals)
        _mint(msg.sender, initialSupply);
        // _mint(msg.sender, 100 * 10**uint(decimals()));
        grantRole(BURNER_ROLE, msg.sender);
    }

    function burn(uint256 value) public onlyRole(BURNER_ROLE) override {
        super._burn(msg.sender, value);
    }
    // prevent sending MATIC to the contract address
    fallback() external payable { revert(); }
}
