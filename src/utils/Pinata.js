const axios = require("axios");
const FormData = require("form-data");
const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export const pinFileToIPFS = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const pinataMetadata = JSON.stringify({
        name: file.name || "File Name",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);

    try {
        const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                maxBodyLength: "Infinity",
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                    Authorization: `Bearer ${JWT}`,
                },
            }
        );
        return res;
    } catch (error) {
        return error;
    }
};

export const pinJSONToIPFS = async (metadata) => {
    const data = JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
            name: `${metadata.name}.json`,
        },
    });

    try {
        const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
            }
        );
        return res;
    } catch (error) {
        return error;
    }
};

export const getPinataUrl = async (tokenUri) => {
    const pinataToken = process.env.NEXT_PUBLIC_PINATA_GATEWAY_KEY;

    try {
        const response = await axios.get(
            `https://green-rapid-felidae-648.mypinata.cloud/ipfs/${tokenUri}?pinataGatewayToken=${pinataToken}`
        );

        return response;
    } catch (error) {
        return error;
    }
};

export const getImageFromPinata = async (imageUrl) => {
    let IPFSUrl = imageUrl.split("/");
    const lastIndex = IPFSUrl.length;
    IPFSUrl = "https://ipfs.io/ipfs/" + IPFSUrl[lastIndex - 1];
    return IPFSUrl;
};
