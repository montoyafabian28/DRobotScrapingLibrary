// main
export function forEachTBodyRow (tableSelector, callback, dbug = false) {
  if (tableSelector === '' || !callback) return null

  const htmlTable = document.querySelector(tableSelector)
  if (!htmlTable) {
    console.warn('No se encontró la tabla con el selector ->', tableSelector)
    return null
  }

  const tableBody = htmlTable.querySelector('tbody')
  if (!tableBody) {
    console.warn('No se encontró el cuerpo de la tabla con el selector ->', tableSelector)
    return null
  }

  const tableBodyRows = tableBody.querySelectorAll('tr')
  if (!tableBodyRows) {
    console.warn('No se encontraron filas en la tabla con el selector ->', tableSelector)
  }

  const tableBodyRowsCells = [...tableBodyRows].map(tr => tr.querySelectorAll('td'))
  const elementsToIterate = [...tableBodyRowsCells]
    .map(tr => [...tr].map(td => td.innerText.trim().toLocaleLowerCase()))

  if (dbug) {
    console.log('forEachTBodyRow ->', tableSelector)
    console.log('Iterando elementos ->', elementsToIterate)
  }

  elementsToIterate.forEach((row, index, array) => {
    if (dbug) console.log('fila ->', row)
    callback(row, index, array)
  })

  return elementsToIterate
}

export function getCellsIndexes (tableHeaderRowSelector, tableTitles) {
  const tableHeader = document.querySelectorAll(`${tableHeaderRowSelector} th`)
  if (tableHeader.length === 0 || tableTitles.length === 0) return null

  let siteTitles = []
  let resultsKeys = []

  if (Array.isArray(tableTitles)) {
    siteTitles = tableTitles
    resultsKeys = tableTitles
  } else {
    siteTitles = Object.keys(tableTitles)
    resultsKeys = Object.values(tableTitles)
  }
  const results = {}

  tableHeader.forEach((th, index) => {
    const thNormalized = th.innerText.trim().toLocaleLowerCase().replaceAll('\n', ' ')

    for (const [tIndex, title] of siteTitles.entries()) {
      const titleNormalized = title.trim().toLocaleLowerCase().replaceAll('\n', ' ')
      const titleKey = resultsKeys[tIndex]

      if (titleNormalized === thNormalized && results[titleKey] === undefined) {
        results[titleKey] = index
        break
      }
    }
  })

  resultsKeys.forEach(key => {
    if (results[key] === undefined) {
      results[key] = null
    }
  })

  return results
}

export function getTableElements (tableSelector) {
  const table = document.querySelector(tableSelector)

  if (!table) return null

  const tableHeader = table.querySelector('thead')
  const tableBody = table.querySelector('tbody')

  let headerRows = null

  if (tableHeader) {
    headerRows = [...tableHeader.querySelectorAll('tr')]
      .map(row => [...row.querySelectorAll('th')])
  }

  const bodyRows = [...tableBody.querySelectorAll('tr')]
    .map(row => [...row.querySelectorAll('td')])

  return {
    table,
    tableHeader,
    tableBody,
    headerRows,
    bodyRows
  }
}
