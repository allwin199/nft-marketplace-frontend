"use client";

import React, { useState } from "react";
import FormField from "../FormField";
import FormTextArea from "../FormTextArea";
import { useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { deployedContract } from "@/constants/index";
import { useRouter } from "next/navigation";
import { pinFileToIPFS, pinJSONToIPFS } from "@/utils/Pinata";

type formFields = {
    name: string;
    description: string;
    price: string;
    imageUrl: string;
};

const initialFormState = {
    name: "",
    description: "",
    price: "",
    imageUrl: "",
};

const SellNft = () => {
    const address = useAddress();
    const router = useRouter();

    const { contract } = useContract(deployedContract);

    const { data: listingPrice, isLoading } = useContractRead(
        contract,
        "getListPrice"
    );

    const [form, setForm] = useState<formFields>(initialFormState);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isListing, setIsListing] = useState(false);

    const handleFormFieldChange = (
        fieldName: keyof formFields,
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [fieldName]: e.target.value });
    };

    const callToBlockchain = async (imageUri: string) => {
        const priceInWei = ethers.utils.parseEther(form.price);

        try {
            const data = await contract?.call(
                "createToken",
                [imageUri, priceInWei],
                {
                    value: listingPrice,
                }
            );
            console.info("contract call successs", data);
            setForm({ ...initialFormState });
            router.push("/");
        } catch (error) {
            console.log("Listing Nft to Marketplace Error");
        } finally {
            setIsListing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsListing(true);
        try {
            const metaData = {
                name: form.name,
                description: form.description,
                image: `ipfs://${form.imageUrl}`,
            };
            const pinataMetdata = await pinJSONToIPFS(metaData);
            callToBlockchain(pinataMetdata.data.IpfsHash);
        } catch (err) {
            console.error("Pinning Metadata to Pinata Error", err);
        }
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (e.target.files) {
                setIsImageUploading(true);
                console.log(e.target.files[0]);
                const pinataResult = await pinFileToIPFS(e.target.files[0]);
                setForm({ ...form, imageUrl: pinataResult.data.IpfsHash });
            }
        } catch (error) {
            console.log("Image Upload to Pinata Error", error);
        } finally {
            setIsImageUploading(false);
        }
    };

    return (
        <div className="container mx-auto my-10 pt-16">
            <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
                <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                    <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                        Sell your NFT
                    </h1>
                </div>
                {address ? (
                    <form
                        onSubmit={handleSubmit}
                        className="w-full mt-[65px] flex flex-col gap-[30px]"
                    >
                        <div className="flex flex-wrap gap-[40px]">
                            <FormField
                                labelName="Nft Name *"
                                placeholder="Nft name 1"
                                inputType="text"
                                value={form.name}
                                handleChange={(e) =>
                                    handleFormFieldChange("name", e)
                                }
                            />
                        </div>

                        <FormTextArea
                            labelName="Nft Description *"
                            placeholder="Nft Description"
                            value={form.description}
                            handleChange={(e) =>
                                handleFormFieldChange("description", e)
                            }
                        />

                        <div className="flex flex-wrap gap-[40px]">
                            <FormField
                                labelName="Price *"
                                placeholder="Price in ETH"
                                inputType="number"
                                value={form.price}
                                handleChange={(e) =>
                                    handleFormFieldChange("price", e)
                                }
                            />
                        </div>

                        <div className="flex-1 w-full flex flex-col">
                            <div className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                                Nft Image *
                            </div>

                            <input
                                required
                                onChange={onFileChange}
                                type="file"
                                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] cursor-pointer"
                            />
                        </div>

                        <div className="flex justify-center items-center mt-[40px]">
                            {isImageUploading ? (
                                <div className="bg-gray-500 px-16 rounded py-3">
                                    Image Uploading...
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isListing}
                                    className="bg-[#0041c2] px-16 rounded py-3"
                                >
                                    {isListing ? "Listing..." : "Submit"}
                                </button>
                            )}
                        </div>
                    </form>
                ) : (
                    <div className="mt-10">
                        Connect your wallet to list an Nft
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellNft;
