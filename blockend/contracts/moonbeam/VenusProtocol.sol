// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;


contract VenusProtocol {

    uint256 public orderIdCounter;
    uint256 public listingIdCounter;
    
    event NFTListed(uint256 listingId, address seller, address tokenAddress, uint256 tokenId, uint256 priceInNative);
    event NftPurchaseInitiated(uint256 orderId, uint256 foreignChainListingId, uint256 wormholeChainId, address buyer, uint256 pricePaidInNative);
    event NftPurchaseCompleted(uint256 orderId, address seller);
    event NftPurchaseFailed(uint256 orderId);

    function purchaseNFT(uint256 listingId, uint256 wormholeChainId) public payable  returns(uint256 orderId){
        emit NftPurchaseInitiated(orderIdCounter, listingId, wormholeChainId, msg.sender, msg.value);
        orderIdCounter++;
        return 0;
    }

    function listNft(address tokenAddress, uint256 tokenId, uint256 nativePrice) public {
        emit NFTListed(listingIdCounter, msg.sender, tokenAddress, tokenId, nativePrice);
        listingIdCounter++;
    }

    function nftPurchaseCallback(uint256 orderId, address seller, bool isSuccess) public {
        if(isSuccess)
        {
            emit NftPurchaseCompleted(orderId, seller);
        }else{
            emit NftPurchaseFailed(orderId);
        }
    }

    function getOrderIdCounter() public view returns(uint256){
        return orderIdCounter;
    }

    function getListingIdCounter() public view returns(uint256){
        return listingIdCounter;
    }


}