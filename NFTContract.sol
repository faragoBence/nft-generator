// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTContract is ERC1155, Ownable {
    using SafeMath for uint256;

    function contractURI()  public pure returns  (string memory) {
        return "OUTPUT/COLLECTION_IPFS_URL";
    }

    constructor() ERC1155("OUTPUT/IPFS_URL/{id}") 
    {
        for (uint i=1; i<=2; i++) {
            mint(msg.sender, i, 1);
        }
    }

    function mint(address account, uint256 id, uint256 amount) public onlyOwner  {
        _mint(account, id, amount, "");
    }

    function uri(uint256 _tokenid) override public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "OUTPUT/IPFS_URL/",
                Strings.toString(_tokenid)
            )
        );
    }
    
}
