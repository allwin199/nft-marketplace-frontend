"use client";

import { useEffect, useState } from "react";
import { useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { deployedContract } from "@/constants/index";
import { getPinataUrl, getImageFromPinata } from "@/utils/Pinata";
import DisplayNfts from "../DisplayNfts/DisplayNfts";

type NftTypes = {
    tokenId: number;
    price: string;
    owner: string;
    seller: string;
    sold: boolean;
    name: string;
    description: string;
    image: string;
};

const Marketplace = () => {
    const address = useAddress();
    const { contract } = useContract(deployedContract);

    const [allTheNfts, setAllTheNfts] = useState<NftTypes[]>();

    const {
        data: allNfts,
        isLoading,
        isSuccess,
    } = useContractRead(contract, "getAllNFTs");

    useEffect(() => {
        const organizeAllNfts = async () => {
            const myNfts = allNfts.filter(
                (nft: NftTypes) => nft.owner == address
            );

            const nfts = await Promise.all(
                myNfts.map(async (nft: NftTypes) => {
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
                        sold: nft.sold,
                        name: name,
                        description: description,
                        image: imageData,
                    };

                    return item;
                })
            );
            setAllTheNfts(nfts.reverse());
        };

        if (!address) {
            setAllTheNfts([]);
            return;
        }

        if (isSuccess) {
            organizeAllNfts();
        }
    }, [isSuccess, allNfts, contract, address]);

    if (isLoading || !allTheNfts) {
        return (
            <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 my-10">
                <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                    <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                        Loading My Nfts...
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-10">
            {allTheNfts && allTheNfts?.length > 0 ? (
                <>
                    <h1 className="text-[18px]">My NFTs</h1>

                    <DisplayNfts nfts={allTheNfts} />
                </>
            ) : (
                <div className="text-[18px] text-white text-left">
                    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 my-10">
                        <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                            <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                                No Nfts Found. Try Buying an Nft.
                            </h1>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
