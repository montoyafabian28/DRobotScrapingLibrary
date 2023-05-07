export function convertDateToUS (date) {
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })

  const formattedDate = dateFormatter.format(new Date(date))
  return formattedDate
}
