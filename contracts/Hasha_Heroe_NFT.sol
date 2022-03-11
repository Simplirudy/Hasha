pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Hasha_Heroe is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    

    constructor(address marketplaceAddress) ERC721("Hasha Heroe", "HSH") {
        contractAddress = marketplaceAddress;
    }

    // mint a new Heroe
    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    // get owner of the Heroe
    function getHeroeOwner(uint256 _tokenId) public view returns(address) {
        address _tokenOwner = ownerOf(_tokenId);
    return _tokenOwner;
  }

    // get metadata of the Heroe
    function getHeroeMetaData(uint _tokenId) public view returns(string memory) {
        string memory tokenMetaData = tokenURI(_tokenId);
    return tokenMetaData;
  }

    // get total number of Heroes owned by an address
    function getTotalNumberOfHeroesOwnedByAnAddress(address _owner) public view returns(uint256) {
        uint256 totalNumberOfTokensOwned = balanceOf(_owner);
    return totalNumberOfTokensOwned;
  }

    // check if the Heroe already exists
    function getHeroeExists(uint256 _tokenId) public view returns(bool) {
        bool tokenExists = _exists(_tokenId);
    return tokenExists;
  }
}