import { useMemo } from 'react'

const DefaultAvatar = ({ name = '', size = 48 }) => {
  const initials = useMemo(() => {
    const names = (name || '').split(' ')
    return names
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2)
  }, [name])

  return (
    <div 
      className="flex items-center justify-center bg-accent text-white font-medium rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.4}px`
      }}
    >
      {initials || 'A'}
    </div>
  )
}

export default DefaultAvatar