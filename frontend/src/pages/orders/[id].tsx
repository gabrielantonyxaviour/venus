import Layout from "@/components/Layout";
import NFTCard from "@/components/NFTCard";
import LoadingSpinner from "@/components/Spinner";
import Confetti from "react-confetti";

import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { WalletClient, decodeEventLog } from "viem";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  useNetwork,
  useWalletClient,
} from "wagmi";
import useWindowSize from "@/hooks/useWindowSize";
import { explorers } from "@/utils/constants";
import { shortenEthereumAddress } from "@/utils";
import TransactionStatusOrder from "@/components/TransactionStatus/TransactionStatusOrder";

export default function Order() {
  const router = useRouter();
  const { address } = useAccount();
  const { id } = router.query;
  const { width, height } = useWindowSize();
  const [txHash, setTxHash] = useState("");
  const [pairBred, setPairBred] = useState("");
  const [tokenAddress, setTokenAddress] = useState(
    "0xd04b45920bcf51518338f783bdc1544844775f21"
  );
  const [tokenId, setTokenId] = useState("1");
  const [chainId, setChainId] = useState("1287");
  const [timeLeft, setTimeLeft] = useState(0);
  const [createdAt, setCreatedAt] = useState("2024-02-28 15:45:36.180961+00");
  const [validity, setValidity] = useState(8000000);
  const [seller, setSeller] = useState(
    "0xd04b45920bcf51518338f783bdc1544844775f21"
  );
  const [buyer, setBuyer] = useState(
    "0x0429A2Da7884CA14E53142988D5845952fE4DF6a"
  );

  useEffect(() => {
    const targetTimestamp =
      Math.floor(new Date(createdAt).getTime() / 1000) + validity;

    const intervalId = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime > targetTimestamp) {
        setTimeLeft(0);
        clearInterval(intervalId);
      } else {
        const remaining = Math.max(0, targetTimestamp - currentTime);

        setTimeLeft(remaining);

        if (remaining === 0) {
          clearInterval(intervalId);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Layout>
      {txHash != "" && pairBred != "" && (
        <Confetti width={width} height={height} />
      )}

      <div className="mt-20 mb-8 w-[80%] mx-auto flex justify-between">
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <NFTCard
              image={
                "https://img.midjourneyapi.xyz/mj/9be0aacb-8978-4c82-88fb-495dee1efe41.png"
              }
              tokenAddress={"0x123"}
              tokenId={"1"}
              chainId={"80001"}
              mode={"create ✨"}
              size={300}
            />
          </div>

          <div className="flex flex-1 flex-col  mx-24">
            <p className="font-bold text-4xl ">Order #{id}</p>
            <div className="flex mt-8 flex justify-between space-x-4">
              <div className="flex-1">
                <p className="font-semibold text-md">Token Address</p>
                <input
                  type="text"
                  placeholder={"Click on the box to upload your NFT"}
                  value={tokenAddress}
                  disabled={true}
                  className="font-theme font-semibold text-[#6c6f70] text-md bg-[#25272b] border border-[#25272b] focus:border-white my-1 pl-6 p-2 rounded-xl focus:outline-none  w-full flex-shrink-0 mr-2"
                />
              </div>
              <div className="w-[30%]">
                <p className="font-semibold text-md">Token Id</p>
                <input
                  type="text"
                  placeholder={"Click on the box to upload your NFT"}
                  value={tokenId}
                  disabled={true}
                  className="font-theme font-semibold text-[#6c6f70] text-md bg-[#25272b] border border-[#25272b] focus:border-white my-1 pl-6  p-2 rounded-xl focus:outline-none  w-full flex-shrink-0 mr-2"
                />
              </div>
            </div>
            <div className="flex mt-8 flex justify-between space-x-4">
              <div className="">
                <p className="font-semibold text-md">Origin Chain</p>
                <Image
                  src={`/chains/${chainId}.png`}
                  width={60}
                  height={60}
                  alt={"Listing"}
                  className="mt-4 ml-2"
                />
              </div>
              <div className="w-[30%] flex flex-col">
                <p className="font-semibold text-md">Price</p>
                <div className="flex-1 py-auto">
                  <p className="mt-6 font-semibold text-xl text-[#9c9e9e] ">
                    {20} GLMR
                  </p>
                </div>
              </div>
            </div>
            <div className="flex mt-8 flex justify-between space-x-4">
              <div className="">
                <p className="font-semibold text-md">Buyer</p>
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    window.open(
                      `https://${explorers["1287"]}/address/${buyer}`
                    );
                  }}
                >
                  <p className="text-xl font-semibold text-[#9c9e9e] my-4 mr-2">
                    {shortenEthereumAddress(buyer)}
                  </p>
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="text-[#9c9e9e] text-sm font-normal my-auto"
                  />
                </div>
              </div>
              <div className="w-[30%]">
                <p className="font-semibold text-md">Seller</p>
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    window.open(
                      `https://${explorers["1287"]}/address/${seller}`
                    );
                  }}
                >
                  <p className="text-xl font-semibold text-[#9c9e9e] my-4 mr-2">
                    {shortenEthereumAddress(seller)}
                  </p>
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="text-[#9c9e9e] text-sm font-normal my-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TransactionStatusOrder
        sourceTransactionHash="0x307d6f2269c7e5df6a5b5aa8347e0fb7cdac5f72084e698201584b441702a308"
        destinationChainId="2424"
        transactionConfirmed={true}
      />
    </Layout>
  );
}
