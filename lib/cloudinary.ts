const VIDEO_UPLOAD = '/video/upload/'

function insertTransformation(src: string, transformation: string) {
  if (!src.includes('res.cloudinary.com') || !src.includes(VIDEO_UPLOAD)) return src

  const [prefix, asset] = src.split(VIDEO_UPLOAD)
  if (!asset || asset.split('/')[0]?.includes('vc_h264')) return src

  return `${prefix}${VIDEO_UPLOAD}${transformation}/${asset}`
}

export function cloudinaryVideo(src: string, width = 1600) {
  return insertTransformation(src, `f_mp4,q_auto:good,vc_h264,w_${width}`)
}

export function cloudinaryVideoPoster(src: string, width = 1600) {
  const transformed = insertTransformation(src, `f_jpg,q_auto:good,w_${width},so_0`)
  return transformed.replace(/\.(?:mp4|mov)(?:\?.*)?$/i, '.jpg')
}
