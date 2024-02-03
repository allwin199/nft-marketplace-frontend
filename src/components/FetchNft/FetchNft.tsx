"use client";

import { useEffect, useState } from "react";
import { useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { deployedContract } from "@/constants/index";
import { getPinataUrl, getImageFromPinata } from "@/utils/Pinata";

type FetchNftPropTypes = {
    id: string;
};

const FetchNft = ({ id }: FetchNftPropTypes) => {
    const { contract } = useContract(deployedContract);
    const address = useAddress();

    const [nftName, setNftName] = useState("");
    const [nftDesc, setNftDesc] = useState("");
    const [nftImage, setNftImage] = useState("");
    const [fetchingData, setFetchingData] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    const {
        data: nft,
        isLoading,
        isSuccess,
        refetch,
    } = useContractRead(contract, "getListedForTokenId", [id]);

    useEffect(() => {
        setFetchingData(true);
        const metadataDetails = async () => {
            try {
                const tokenUri = await contract?.call("tokenURI", [
                    nft.tokenId,
                ]);

                const metadata = await getPinataUrl(tokenUri);
                const { name, description, image } = metadata.data;
                const imageData = await getImageFromPinata(image);

                console.log("imageData", imageData);

                setNftName(name);
                setNftDesc(description);
                setNftImage(imageData);
            } catch (error) {
                console.log(error);
            } finally {
                setFetchingData(false);
            }
        };

        if (isSuccess) {
            metadataDetails();
        }
    }, [isSuccess, contract, nft]);

    const buyNft = async () => {
        setIsBuying(true);
        try {
            await contract?.call("executeSale", [id], {
                value: nft.price,
            });
            refetch();
        } catch (error) {
            console.log(error);
        } finally {
            setIsBuying(false);
        }
    };

    if (isLoading || (fetchingData && !isBuying)) {
        return (
            <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 my-10">
                <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                    <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                        Nft Loading...
                    </h1>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#222222]">
                        {/* eslint-disable @next/next/no-img-element */}
                        <img
                            src={nftImage}
                            alt="campaign"
                            className="w-[300px] h-[330px] object-fit rounded-xl"
                        />
                    </div>
                    <div>
                        <div className="mt-2 flex">
                            <div>
                                Name
                                <p className="text-sm mt-2">{nftName}</p>
                            </div>
                            <div className="ml-8">
                                Price
                                <p className="text-sm mt-2">
                                    {ethers.utils.formatEther(
                                        nft.price.toString()
                                    )}{" "}
                                    ETH
                                </p>
                            </div>
                        </div>
                        <div className="mt-10">
                            {address == nft.seller ? (
                                "You own this NFT"
                            ) : (
                                <>
                                    {address ? (
                                        <button
                                            onClick={buyNft}
                                            disabled={isBuying}
                                            className="bg-[#0041c2] px-16 rounded py-3"
                                        >
                                            {/* {isListing ? "Listing..." : "Buy"} */}
                                            {isBuying ? "Buying..." : "Buy"}
                                        </button>
                                    ) : (
                                        <div className="bg-gray-500 rounded py-3 w-[300px] text-center">
                                            Connect your wallet to Buy
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <div>
                        <h4 className="text-xl text-gray-300">Creator</h4>
                        <span className="text-sm text-gray-400">
                            {nft.seller}
                        </span>
                    </div>
                    <div className="mt-6">
                        <h4 className="text-xl text-gray-300">Description</h4>
                        <span className="text-sm text-gray-400">{nftDesc}</span>
                    </div>
                </div>
            </div>
        );
    }
};

export default FetchNft;
