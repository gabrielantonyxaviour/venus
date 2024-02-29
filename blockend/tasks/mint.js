const { networks } = require("../networks");
task("mint-test-nft", "Mints test nft to the user").setAction(
  async (taskArgs, hre) => {
    try {
      const owner = "0x0429A2Da7884CA14E53142988D5845952fE4DF6a";
      const tokenUri = "https://picsum.photos/200/300";
      const functionHash = ethers.utils
        .id("safeMint(address,string)")
        .slice(0, 10);
      console.log(functionHash);

      const encodedData = ethers.utils.defaultAbiCoder
        .encode(["address", "string"], [owner, tokenUri])
        .slice(2);
      console.log(functionHash + encodedData);
    } catch (error) {
      console.log(error);
    }
  }
);
