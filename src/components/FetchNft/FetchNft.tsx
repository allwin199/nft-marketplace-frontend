"use client";

import { useEffect, useState } from "react";
import { useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import FormField from "../SellNft/FormField";
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
    const [sellingPrice, setSellingPrice] = useState("0");
    const [isReselling, setIsReselling] = useState(false);

    const {
        data: nft,
        isLoading,
        isSuccess,
        refetch,
    } = useContractRead(contract, "getItemForTokenId", [id]);

    const { data: listingPrice } = useContractRead(contract, "getListingPrice");

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

    const reSellNft = async () => {
        setIsReselling(true);
        const priceInWei = ethers.utils.parseEther(sellingPrice.toString());
        try {
            await contract?.call("reSellNft", [id, priceInWei], {
                value: listingPrice,
            });
            refetch();
            setSellingPrice("0");
        } catch (error) {
            console.log(error);
        } finally {
            setIsReselling(false);
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
                <div className="flex gap-10">
                    <div className="">
                        {/* eslint-disable @next/next/no-img-element */}
                        <img
                            src={nftImage}
                            alt="campaign"
                            className="w-[450px] h-[300px] object-cover rounded-xl"
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
                                <div>
                                    <p>You own this NFT</p>

                                    <form>
                                        <div className="flex flex-wrap gap-[40px] mt-8">
                                            <FormField
                                                labelName="Re-Sell Price *"
                                                placeholder="Price in ETH"
                                                inputType="number"
                                                value={sellingPrice}
                                                handleChange={(e) =>
                                                    setSellingPrice(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <button
                                            onClick={reSellNft}
                                            disabled={isReselling}
                                            className="bg-[#0041c2] px-16 rounded py-3 mt-4"
                                        >
                                            {isReselling
                                                ? "Selling..."
                                                : "Sell"}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    {address ? (
                                        <div>
                                            {!nft.sold ? (
                                                <button
                                                    onClick={buyNft}
                                                    disabled={isBuying}
                                                    className="bg-[#0041c2] px-16 rounded py-3"
                                                >
                                                    {isBuying
                                                        ? "Buying..."
                                                        : "Buy"}
                                                </button>
                                            ) : null}
                                        </div>
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
