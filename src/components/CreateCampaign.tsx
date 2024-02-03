"use client";

import React, { useState } from "react";
import FormField from "../FormField";
import FormTextArea from "../FormTextArea";
import { useContract, useContractWrite, useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { deployedContract } from "@/constants/index";
import { useRouter } from "next/navigation";

type formFields = {
    name: string;
    description: string;
    targetAmount: string;
    endAt: string;
    image: string;
};

const initialFormState = {
    name: "",
    description: "",
    targetAmount: "",
    endAt: "",
    image: "",
};

const CreateCampaign = () => {
    const address = useAddress();
    const router = useRouter();

    const { contract } = useContract(deployedContract);

    const {
        mutateAsync: createCampaign,
        isLoading,
        isSuccess,
    } = useContractWrite(contract, "createCampaign");

    const [form, setForm] = useState<formFields>(initialFormState);

    const handleFormFieldChange = (
        fieldName: keyof formFields,
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [fieldName]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // const formEndDate = new Date(form.endAt);
        const parseTargetAmount = ethers.utils.parseEther(form.targetAmount);
        // const endDateInSeconds = Math.floor(formEndDate.getTime() / 1000);
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);

        let endDate;

        // if (endDateInSeconds < currentTimeInSeconds) {
        //     endDate = currentTimeInSeconds + 100;
        // } else {
        //     endDate = endDateInSeconds + 100;
        // }

        endDate = currentTimeInSeconds + 30;

        try {
            const data = await createCampaign({
                args: [
                    form.name,
                    form.description,
                    parseTargetAmount,
                    endDate,
                    form.image,
                ],
            });
            setForm(initialFormState);
            router.push("/campaigns");
            console.info("contract call successs", data);
        } catch (err) {
            console.error("contract call failure", err);
        }
    };

    if (isLoading && !isSuccess) {
        return (
            <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 mb-10">
                <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                    <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                        Creating a new campaign...
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 mb-10">
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                    Create Campaign
                </h1>
            </div>
            {address ? (
                <form
                    onSubmit={handleSubmit}
                    className="w-full mt-[65px] flex flex-col gap-[30px]"
                >
                    <div className="flex flex-wrap gap-[40px]">
                        <FormField
                            labelName="Campaign Name *"
                            placeholder="Campaign 1"
                            inputType="text"
                            value={form.name}
                            handleChange={(e) =>
                                handleFormFieldChange("name", e)
                            }
                        />
                    </div>

                    <FormTextArea
                        labelName="Description *"
                        placeholder="Campaign Description"
                        value={form.description}
                        handleChange={(e) =>
                            handleFormFieldChange("description", e)
                        }
                    />

                    <div className="flex flex-wrap gap-[40px]">
                        <FormField
                            labelName="Goal *"
                            placeholder="ETH 0.50"
                            inputType="number"
                            value={form.targetAmount}
                            handleChange={(e) =>
                                handleFormFieldChange("targetAmount", e)
                            }
                        />
                        <FormField
                            labelName="End Date *"
                            placeholder="End Date"
                            inputType="date"
                            value={form.endAt}
                            handleChange={(e) =>
                                handleFormFieldChange("endAt", e)
                            }
                        />
                    </div>

                    <FormField
                        labelName="Campaign image *"
                        placeholder="Place image URL of your campaign"
                        inputType="url"
                        value={form.image}
                        handleChange={(e) => handleFormFieldChange("image", e)}
                    />

                    <div className="flex justify-center items-center mt-[40px]">
                        <button
                            type="submit"
                            className="bg-[#0041c2] px-16 rounded py-3"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mt-10">
                    Connect your wallet to create a new campaign
                </div>
            )}
        </div>
    );
};

export default CreateCampaign;
