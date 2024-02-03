"use client";

import { useEffect, useState } from "react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { deployedContract } from "@/constants/index";
import { getPinataUrl, getImageFromPinata } from "@/utils/Pinata";
import DisplayNfts from "../DisplayNfts/DisplayNfts";

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

    const [allTheNfs, setAllTheNfts] = useState<NftTypes[]>([]);

    const {
        data: allNfts,
        isLoading,
        isSuccess,
    } = useContractRead(contract, "getAllNFTs");

    useEffect(() => {
        const fetchAllNfts = async () => {
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
            fetchAllNfts();
        }
    }, [isSuccess, allNfts, contract]);

    return (
        <div className="mt-10">
            <h1 className="text-[18px]">Top NFTs</h1>

            <DisplayNfts nfts={allTheNfs} />
        </div>
    );
};

export default Marketplace;
