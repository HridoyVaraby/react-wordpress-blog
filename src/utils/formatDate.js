import { format, parseISO } from 'date-fns'

export const formatDate = (dateString) => {
  try {
    if (!dateString) return ''
    const date = parseISO(dateString)
    return format(date, 'd MMM yyyy')
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}