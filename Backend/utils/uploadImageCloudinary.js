import {v2 as cloudinary} from 'cloudinary'

const uploadImageCloudinary = async(image) => {
    const buffer= Buffer.from(await image.arrayBuffer())

    const uploadImage = await new Promise((resolve, reject) => {
cloudinary.uploader.upload_stream({ folder : "blinkeyit"}, (error, uploadResult) => {
    return resolve(uploadResult)
}).end(buffer)
    })
    return uploadImage
}

