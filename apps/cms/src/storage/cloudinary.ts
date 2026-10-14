import { randomUUID } from 'node:crypto'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'

function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
  const api_key = process.env.CLOUDINARY_API_KEY
  const api_secret = process.env.CLOUDINARY_API_SECRET
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error('Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in the CMS environment before uploading images.')
  }
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true })
}

export const cloudinaryAdapter: Adapter = () => ({
  name: 'cloudinary',
  fields: [
    {
      name: 'cloudinaryURL', type: 'text', admin: { readOnly: true },
      access: { create: () => false, update: () => false },
    },
    {
      name: 'cloudinaryPublicID', type: 'text', admin: { readOnly: true },
      access: { create: () => false, update: () => false },
    },
  ],
  async handleUpload({ file }) {
    configureCloudinary()
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          public_id: randomUUID(),
          asset_folder: process.env.CLOUDINARY_FOLDER || 'martasieczkowska',
          overwrite: false,
        },
        (error, uploaded) => {
          if (error) reject(error)
          else if (uploaded) resolve(uploaded)
          else reject(new Error('Cloudinary did not return the uploaded image.'))
        },
      )
      stream.end(file.buffer)
    })
    return {
      url: result.secure_url,
      cloudinaryURL: result.secure_url,
      cloudinaryPublicID: result.public_id,
      width: result.width,
      height: result.height,
    }
  },
  generateURL: ({ data }) => data.cloudinaryURL || '',
  // Keep historical files available to already deployed static pages.
  // Removing a Media record does not remove its asset from Cloudinary.
  handleDelete: () => {},
  staticHandler: () => new Response('Images are served directly by Cloudinary.', { status: 404 }),
})
