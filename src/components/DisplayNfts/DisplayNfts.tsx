import Link from "next/link";

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

type NftProps = {
    nfts: NftTypes[];
};

const DisplayNfts = ({ nfts }: NftProps) => {
    const nftOwner = (address: string) => {
        const slice1 = address.slice(0, 6);
        const slice2 = address.slice(-4);

        return slice1 + "..." + slice2;
    };

    return (
        <div className="grid grid-cols-4 gap-10 my-6">
            {nfts.map((nft) => (
                <Link href={`/nfts/${nft.tokenId}`} key={nft.tokenId}>
                    <div className="rounded-[15px] bg-[#3a3a43] cursor-pointer text-sm">
                        {/* eslint-disable @next/next/no-img-element */}
                        <img
                            src={nft.image}
                            alt="fund"
                            className="w-full h-[180px] object-cover rounded-[15px]"
                        />
                        <div className="p-4">
                            <div className="block">
                                <h3 className="text-base text-left leading-[26px] truncate">
                                    {nft.name}
                                </h3>
                                <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">
                                    {nft.description}
                                </p>
                            </div>

                            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px] mt-6">
                                {nft.price} ETH
                            </h4>

                            <div className="flex items-center mt-[16px] gap-[12px]">
                                <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
                                    Created by{" "}
                                    <span className="text-[#b2b3bd]">
                                        {nftOwner(nft.seller)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default DisplayNfts;
