const { networks } = require("../../networks");

task("deploy-testing", "Deploys the Testing contract")
  .addOptionalParam(
    "verify",
    "Set to true to verify contract",
    false,
    types.boolean
  )
  .setAction(async (taskArgs) => {
    console.log(`Deploying Testing contract to ${network.name}`);

    console.log("\n__Compiling Contracts__");
    await run("compile");
    console.log({
      chainId: networks[network.name].chainId,
      wormholeCoreBridge: networks[network.name].wormholeCoreBridge,
    });
    const testingContractFactory = await ethers.getContractFactory("Testing");
    const testingContract = await testingContractFactory.deploy(
      networks[network.name].wormholeChainId,
      networks[network.name].wormholeCoreBridge
    );

    console.log(
      `\nWaiting ${
        networks[network.name].confirmations
      } blocks for transaction ${
        testingContract.deployTransaction.hash
      } to be confirmed...`
    );

    await testingContract.deployTransaction.wait(
      networks[network.name].confirmations
    );

    console.log("\nDeployed Testing contract to:", testingContract.address);

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
          address: testingContract.address,
          constructorArguments: [
            networks[network.name].wormholeChainId,
            networks[network.name].wormholeCoreBridge,
          ],
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
      `\n Testing contract deployed to ${testingContract.address} on ${network.name}`
    );
  });
