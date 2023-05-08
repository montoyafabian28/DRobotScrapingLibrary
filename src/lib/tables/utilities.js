// main
export function forEachBodyRow (tableSelector, callback, dbug = false) {
  if (tableSelector === '' || typeof callback !== 'function') return

  const htmlTable = document.querySelector(tableSelector)

  if (!htmlTable) {
    console.warn('No se encontró la tabla con el selector ->', tableSelector)
    return
  }

  const tableBody = htmlTable.querySelector('tbody')

  if (!tableBody) {
    console.warn('No se encontró el cuerpo de la tabla con el selector ->', tableSelector)
    return
  }

  const tableBodyRows = tableBody.querySelectorAll('tr')

  if (tableBodyRows.length === 0) {
    console.warn('No se encontraron filas en la tabla con el selector ->', tableSelector)
    return
  }

  const tableBodyRowsAndCells = [...tableBodyRows].map(tr => {
    const tdList = [...tr.querySelectorAll('td')]
    const tdTextList = tdList.map(td => td.innerText.trim().toLocaleLowerCase())
    return [tr, tdList, tdTextList]
  })

  if (dbug) {
    console.log('forEachBodyRow ->', tableSelector)
    console.log('Iterando elementos ->', tableBodyRowsAndCells)
  }

  tableBodyRowsAndCells.forEach((row, index, array) => {
    const [tr, tdList, tdTextList] = row

    if (dbug) {
      console.log('fila ->', tdTextList)
      console.log('tr ->', tr)
      console.log('lista de td\'s ->', tdList)
    }
    callback(tdTextList, index, tr, tdList, array)
  })
}

export function getCellsIndexes (tableHeaderRowSelector, tableTitles) {
  const tableHeader = document.querySelectorAll(`${tableHeaderRowSelector} th`)
  if (tableHeader.length === 0) return null

  let siteTitles = []
  let resultsKeys = []

  if (Array.isArray(tableTitles)) {
    siteTitles = tableTitles
    resultsKeys = tableTitles
  } else {
    siteTitles = Object.keys(tableTitles)
    resultsKeys = Object.values(tableTitles)
  }

  if (siteTitles.length === 0 || resultsKeys.length === 0) return null

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
  console.log('Indexes of ', tableHeaderRowSelector)
  console.log('->', { ...results })
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

export function getRepitedRows (rows, areEqualRows) {
  const allRepeatedRows = []

  rows.forEach((row, index) => {
    const rowRest = rows.slice(index + 1)

    if (rowRest.length === 0) return

    const repeatedRows = rowRest.filter(row2 => areEqualRows(row, row2))

    if (repeatedRows.length === 0) return

    const alreadyInRepeatedRows = allRepeatedRows
      .some(repeatedRow => areEqualRows(repeatedRow, row))

    if (!alreadyInRepeatedRows) {
      allRepeatedRows.push([row, ...repeatedRows])
    }
  })
}
