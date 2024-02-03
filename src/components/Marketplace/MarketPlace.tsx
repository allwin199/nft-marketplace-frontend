import React from "react";

const Marketplace = () => {
    const sampleData = [
        {
            name: "NFT#1",
            description: "Alchemy's First NFT",
            website: "http://axieinfinity.io",
            image: "https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
            price: "0.03ETH",
            currentlySelling: "True",
            address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            name: "NFT#2",
            description: "Alchemy's Second NFT",
            website: "http://axieinfinity.io",
            image: "https://gateway.pinata.cloud/ipfs/QmdhoL9K8my2vi3fej97foiqGmJ389SMs55oC5EdkrxF2M",
            price: "0.03ETH",
            currentlySelling: "True",
            address: "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            name: "NFT#3",
            description: "Alchemy's Third NFT",
            website: "http://axieinfinity.io",
            image: "https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
            price: "0.03ETH",
            currentlySelling: "True",
            address: "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
        },
    ];
    return (
        <div className="mt-10">
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold text-white mb-10">
                    Top NFTs
                </div>
                <div className="flex mt-10 justify-between flex-wrap max-w-screen-xl text-center">
                    {sampleData.map((value, index) => {
                        return (
                            <div
                                className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl"
                                key={value.name}
                            >
                                {/* <img
                                    src={IPFSUrl}
                                    alt=""
                                    className="w-72 h-80 rounded-lg object-cover"
                                    crossOrigin="anonymous"
                                /> */}
                                <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
                                    <strong className="text-xl">
                                        {value.name}
                                    </strong>
                                    <p className="display-inline">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
