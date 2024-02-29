// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;


contract VenusConnector {

    uint256 public listingIdCounter;
    
    event NFTListed(uint256 listingId, address seller, address tokenAddress, uint256 tokenId, uint256 priceInNative);

    function listNft(address tokenAddress, uint256 tokenId, uint256 nativePrice) public {
        emit NFTListed(listingIdCounter, msg.sender, tokenAddress, tokenId, nativePrice);
        listingIdCounter++;
    }

    function getListingIdCounter() public view returns(uint256){
        return listingIdCounter;
    }

}