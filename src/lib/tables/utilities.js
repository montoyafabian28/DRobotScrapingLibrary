// main
export function forEachRow (callback, selectors, dbug = true) {
  if (typeof callback !== 'function' ||
  !Array.isArray(selectors)) return

  let rowsSelector = 'table tr'
  let cellsSelector = ''

  if (selectors.length === 0 || selectors.length === 1) {
    cellsSelector = 'td'
  } else {
    const [selector1, selector2] = selectors
    rowsSelector = selector1
    cellsSelector = selector2
  }

  const rows = document.querySelectorAll(rowsSelector)

  if (rows.length === 0) {
    console.log('forEachRow')
    console.warn('No se encontraron filas con el selector ->', rowsSelector)
    return
  }

  const rowsAndCells = [...rows].map(tr => {
    const tdList = [...tr.querySelectorAll(cellsSelector)]
    if (tdList.length === 0) return [[], [], tr]

    const tdTextList = tdList.map(td => td.innerText.trim().toLocaleLowerCase())
    return [tdTextList, tdList, tr]
  })

  if (dbug) {
    console.log('------------------------------------------')
    console.log(`forEachRow para --> ${rowsSelector} <--`)
    console.log('Iterando elementos ->', rowsAndCells)
  }

  rowsAndCells.forEach((row, index, array) => {
    const [tdTextList, tdList, tr] = row

    if (dbug) {
      console.log('------------------------------------------')
      console.log(`Fila ${index.toString()} ->`, tdTextList)
      console.log('Lista de elementos html ->', tdList)
      console.log('Elemento html fila ->', tr)
    }
    callback(tdTextList, index, tdList, tr, array)
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
  console.log('getCellsIndexes para ', tableHeaderRowSelector)
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

  let bodyRows = null
  if (!tableBody) {
    bodyRows = [...table.querySelectorAll('tr')]
      .map(row => [...row.querySelectorAll('td')])
  } else {
    bodyRows = [...tableBody.querySelectorAll('tr')]
      .map(row => [...row.querySelectorAll('td')])
  }

  const bodyRowsText = bodyRows.map(row => row.map(td => 
    td.innerText.trim().toLocaleLowerCase()))

  return {
    table,
    tableHeader,
    tableBody,
    headerRows,
    bodyRows,
    bodyRowsText
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

export function findInRows 