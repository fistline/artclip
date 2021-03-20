// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Artclip is ERC721{

    string origin;

    struct Clip {
        string  contentid;  // 콘텐츠아이디
        uint256 seq; //  순번
    }

    Clip[] public clips; // 첫 아이템의 인덱스는 0입니다
    address public owner;

     /** List of agents(system) allowed to manage mint */
    mapping (address => bool) public mintManagers;

    constructor () public {
        owner = msg.sender; // owner
        origin = "https://www.artclip.co";
    }

   /**
    * @dev Check if you are a mint manager.
    */
    modifier onlyManagers() {
        require(mintManagers[msg.sender], "[Validation] sender is not a mint manager.");
        _;
    }

     /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public {
        require(newOwner != address(0), "[Validation]  new owner is the zero address");
        require(owner == msg.sender, "[Validation] owner only access"); // owner only
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }


   /**
   * @dev setup manager
   */
    function setManager(address addr, bool state) public {
        require(owner == msg.sender, "[Validation] owner only access");
        mintManagers[addr] = state;
        emit ManagerChanged(addr, state);
    }


    function getOrigin() public view returns (string memory ) {
        return origin;
    }

    function setOrigin(string _origin) public {
        require(owner == msg.sender, "[Validation] owner only access"); // owner only
        origin = _origin;
    }

    function mintClip(string memory contentid, uint256 seq, address account) public onlyManagers {
        uint256 clipId = clips.length; // clip index
        clips.push(Clip(contentid, seq));
        _mint(account, clipId); // 새 카드를 발행
    }

    /**
     * @dev This is a function for withdrawal of erc20 tokens.
     *
     * Emits a {Withdraw} event.
     */
    function withdrowErc20(address _tokenAddr, address _to, uint _value) public {
        require(owner == msg.sender, "[Validation] owner only access");
        ERC20 erc20 = ERC20(_tokenAddr);
        erc20.transfer(_to, _value);
        emit WithdrowErc20Token(_tokenAddr, _to, _value);
    }

    event ManagerChanged(address indexed manager, bool state);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
}
