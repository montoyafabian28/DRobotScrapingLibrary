console.log('s.js')
export function forEachBodyRow (tableSelector, callback) {
  const htmlTable = document.querySelector(tableSelector)
  if (!htmlTable) return

  const selector = 'tbody tr'
  const innerSelector = 'td'
  const elementsToIterate = [...htmlTable.querySelectorAll(selector)]
    .map(tr => [...tr.querySelectorAll(innerSelector)]
      .map(cell => cell.innerText.trim().toLocaleLowerCase()))

  elementsToIterate.forEach((row, index, array) => {
    callback(row, index, array)
  })
}
