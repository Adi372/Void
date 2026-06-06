const ImageKit = require('imagekit');

const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
})

async function uploadFile (file, filename) {
    const response = await imagekit.upload({
        file: file,
        fileName: filename,
        folder: "User-Data"
    })
    return response.url;
}

module.exports = uploadFile;