'use client'

import Image, { type ImageLoaderProps, type ImageProps } from 'next/image'

// Serve the requested responsive width directly from Cloudinary, without
// transferring the original PNG to Next's optimizer. Local assets use Next.
function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  const upload = src.indexOf('/upload/') + '/upload/'.length
  const asset = src.slice(upload)
  const version = asset.search(/(?:^|\/)v\d+\//)
  const existing = version > 0 ? `${asset.slice(0, version)}/` : ''
  const original = version >= 0 ? asset.slice(version).replace(/^\//, '') : asset
  return `${src.slice(0, upload)}${existing}f_auto,c_limit,w_${width},q_${quality ?? 85}/${original}`
}

export default function EditorialImage(props: ImageProps) {
  const cloudinary = typeof props.src === 'string' && props.src.startsWith('https://res.cloudinary.com/dazhkrimv/')
  return <Image {...props} loader={cloudinary ? cloudinaryLoader : undefined} />
}
