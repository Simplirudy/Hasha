pragma solidity ^0.8.12;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract HashaGame is AccessControlUpgradeable  {


/* TO ADD
Gain XP
Game wins
Game losses
Game played
Player Level


 */
    uint8 minLength;
    uint8 maxLength;
    uint8 maxPic;

    mapping (address => uint) public addressToIndex;
    mapping (string => uint) public nameToIndex;
    address[] public addresses;

    struct Player {
        // The id.
        uint256 id;
        // The address of the player.
        address owner;
        // The name of the player.
        string name;
        // When the player was created.
        uint64 created;
        // The player picture id.
        uint8 picId;
        // The player exist
        bool isValue;
    }

    bool constant isValue = true;
    mapping (uint256 => Player) public players;


    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");

    event PlayerCreated(uint256 profileId, address owner, string name, uint64 created, uint8 picId);
    // event PlayerUpdated(uint256 profileId, address owner, string name, uint64 created, uint8 picId);

    function initialize() initializer public {
        __AccessControl_init();    
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        minLength = 3;
        maxLength = 16;
        maxPic = 15;

        addresses.push(address(0));
        addressToIndex[address(0)] = 0;
        nameToIndex["self"] = 0;

        Player memory player = Player(
            0,
            address(0),
            "self",
            uint64(block.timestamp),
            0,
            true
        );

        players[0] = player;
    }

    ///  Checks if a profile exists for an address.
    function playerExists(address playerAddress) public view returns(bool exist){
        // Player storage player = players[addressToIndex[playerAddress]];
        if (players[addressToIndex[playerAddress]].isValue) {
            return true;      
        }
    }

    /// Checks if a name is taken.
    function nameTaken(string memory name) public view returns (bool taken) {
        return (nameToIndex[name] > 0);
    }

    ///  Creates a Player.
    function createPlayer(string memory _name, uint8 _picId) public returns (bool success) {
        require(!playerExists(msg.sender), "player already exists");
        require(!nameTaken(_name), "name already taken");
        // Enforce maximum length.
        require(bytes(_name).length >= minLength, "name too short");
        require(bytes(_name).length <= maxLength, "name too long");

        uint256 playerId = addresses.length;

        addresses.push(msg.sender);
        addressToIndex[msg.sender] = playerId;
        nameToIndex[_name] = playerId;

        Player memory player = Player(
            playerId,
            msg.sender,
            _name,
            uint64(block.timestamp),
            _picId,
            true
        );

        players[playerId] = player;

        emit PlayerCreated(
            playerId,
            player.owner,
            player.name,
            player.created,
            player.picId
        );

        return true;
    }

    ///  Gets the total number of players.
    function getPlayerCount() public view returns (uint count) {
        return addresses.length;
    }

    ///  Gets the player by name.
    function getPlayerByName(string memory name) public view returns (uint256 _id, address _owner, string memory _name, uint64 _created, uint8 _picId) {
        require(nameTaken(name), "name not found");
        Player memory player = players[nameToIndex[name]];
        return (player.id, player.owner, player.name, player.created, player.picId);
    }

    ///  Gets the address of a name.
    function getAddressByName(string memory name) public view returns (address playerAddress) {
        require(nameTaken(name), "name not found");
        return addresses[nameToIndex[name]];
    }

}