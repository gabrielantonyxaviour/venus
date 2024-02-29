const { networks } = require("../../networks");

task("deploy-sample-nft", "Deploys the SampleNft contract")
  .addOptionalParam(
    "verify",
    "Set to true to verify contract",
    false,
    types.boolean
  )
  .setAction(async (taskArgs) => {
    console.log(`Deploying SampleNft contract to ${network.name}`);

    console.log("\n__Compiling Contracts__");
    await run("compile");

    const initalOwner = "0x0429A2Da7884CA14E53142988D5845952fE4DF6a";

    const sampleNftFactory = await ethers.getContractFactory("SampleNft");
    const sampleNft = await sampleNftFactory.deploy(initalOwner);

    console.log(
      `\nWaiting ${
        networks[network.name].confirmations
      } blocks for transaction ${
        sampleNft.deployTransaction.hash
      } to be confirmed...`
    );

    await sampleNft.deployTransaction.wait(
      networks[network.name].confirmations
    );

    console.log("\nDeployed SampleNft contract to:", sampleNft.address);

    if (network.name === "localFunctionsTestnet") {
      return;
    }

    const verifyContract = taskArgs.verify;
    if (
      network.name !== "localFunctionsTestnet" &&
      verifyContract &&
      !!networks[network.name].verifyApiKey &&
      networks[network.name].verifyApiKey !== "UNSET"
    ) {
      try {
        console.log("\nVerifying contract...");
        await run("verify:verify", {
          address: sampleNft.address,
          constructorArguments: [initalOwner],
        });
        console.log("Contract verified");
      } catch (error) {
        if (!error.message.includes("Already Verified")) {
          console.log(
            "Error verifying contract.  Ensure you are waiting for enough confirmation blocks, delete the build folder and try again."
          );
          console.log(error);
        } else {
          console.log("Contract already verified");
        }
      }
    } else if (verifyContract && network.name !== "localFunctionsTestnet") {
      console.log(
        "\nPOLYGONSCAN_API_KEY, ETHERSCAN_API_KEY or FUJI_SNOWTRACE_API_KEY is missing. Skipping contract verification..."
      );
    }

    console.log(
      `\n SampleNft contract deployed to ${sampleNft.address} on ${network.name}`
    );
  });
