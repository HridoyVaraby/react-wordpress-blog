export const getGravatarUrl = (hash, size = 96) => {
  const validSizes = [24, 48, 96, 192, 256]
  const validatedSize = validSizes.includes(size) ? size : 96
  
  // First-party proxy endpoint with fallback
  return `/wp-json/inside-design/v1/gravatar-proxy?hash=${hash}&s=${validatedSize}&d=mm&r=g`
}

export const getFallbackAvatar = (initial, size = 96) => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#F3F4F6'
  ctx.fillRect(0, 0, size, size)
  
  ctx.font = `${size/2}px system-ui`
  ctx.fillStyle = '#6B7280'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initial.toUpperCase(), size/2, size/2)
  
  return canvas.toDataURL()
}