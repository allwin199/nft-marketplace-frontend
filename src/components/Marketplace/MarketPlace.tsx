"use client";

import { useEffect, useState } from "react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { deployedContract } from "@/constants/index";
import { getPinataUrl, getImageFromPinata } from "@/utils/Pinata";
import DisplayNfts from "../DisplayNfts/DisplayNfts";
import { Allerta_Stencil } from "next/font/google";

type NftTypes = {
    tokenId: number;
    price: string;
    owner: string;
    seller: string;
    currentlyListed: boolean;
    name: string;
    description: string;
    image: string;
};

const Marketplace = () => {
    const { contract } = useContract(deployedContract);

    const [allTheNfts, setAllTheNfts] = useState<NftTypes[]>();

    const {
        data: allNfts,
        isLoading,
        isSuccess,
    } = useContractRead(contract, "getAllNFTs");

    useEffect(() => {
        const organizeAllNfts = async () => {
            const nfts = await Promise.all(
                allNfts.map(async (nft: NftTypes) => {
                    const tokenUri = await contract?.call("tokenURI", [
                        nft.tokenId,
                    ]);

                    const metadata = await getPinataUrl(tokenUri);
                    const { name, description, image } = metadata.data;
                    const imageData = await getImageFromPinata(image);

                    const item = {
                        tokenId: nft.tokenId,
                        price: ethers.utils.formatEther(nft.price.toString()),
                        owner: nft.owner,
                        seller: nft.seller,
                        currentlyListed: nft.currentlyListed,
                        name: name,
                        description: description,
                        image: imageData,
                    };

                    return item;
                })
            );
            setAllTheNfts(nfts.reverse());
        };

        if (isSuccess) {
            organizeAllNfts();
        }
    }, [isSuccess, allNfts, contract]);

    if (isLoading || !allTheNfts) {
        return (
            <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 my-10">
                <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                    <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                        Loading Marketplace...
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-10">
            {allTheNfts && allTheNfts?.length > 0 ? (
                <>
                    <h1 className="text-[18px]">Top NFTs</h1>

                    <DisplayNfts nfts={allTheNfts} />
                </>
            ) : (
                <div className="text-[18px] text-white text-left">
                    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 my-10">
                        <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                            <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                                No Nfts Found. Try adding a new Nft.
                            </h1>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
