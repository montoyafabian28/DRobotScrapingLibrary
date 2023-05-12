(function (window, document) {
  const dr = function () {
    const library = {
      convertToDate: (day, month, year) => {
        const getMonth = {
          January: '01',
          February: '02',
          March: '03',
          April: '04',
          May: '05',
          June: '06',
          July: '07',
          August: '08',
          September: '09',
          October: '10',
          November: '11',
          December: '12'
        }
        day = parseInt(day).toString().length === 1 ? '0'.concat(day) : day.trim()
        return getMonth[month] + '/' + day + '/' + year
      },
      addYear: (date) => {
        if (!date) { return }
        date = new Date(date)
        date.setDate(date.getDate() + 364)
        const month = (date.getMonth() + 1).toString().length === 1 ? '0' + parseInt((date.getMonth() + 1)).toString() : date.getMonth() + 1
        const day = (date.getDate() + 1).toString().length === 1 ? '0' + parseInt((date.getDate() + 1)).toString() : date.getDate()
        return month + '/' + day + '/' + date.getFullYear()
      },
      getTableElements: (tableSelector, rowSelector = 'tr', cellSelectors = ['th', 'td']) => {
        const [headerCellSelector, bodyCellSelector] = cellSelectors
        const table = document.querySelector(tableSelector)

        if (!table) throw new Error('Tabla no encontrada, selector: ' + tableSelector)

        const tableHeader = table.querySelector('thead')
        const tableBody = table.querySelector('tbody') ?? table

        let headerRows = []
        let headerRowsText = []

        if (tableHeader) {
          headerRows = [...tableHeader.querySelectorAll(rowSelector)]
            .map(row => [...row.querySelectorAll(headerCellSelector)])
          headerRowsText = headerRows.map(row => row.map(th =>
            th.innerText.trim().toLocaleLowerCase()))
        }

        const bodyRows = [...tableBody.querySelectorAll(rowSelector)]
          .map(row => [...row.querySelectorAll(bodyCellSelector)])

        const bodyRowsText = bodyRows.map(row => row.map(td =>
          td.innerText.trim().toLocaleLowerCase()))

        return {
          table,
          tableHeader,
          tableBody,
          headerRows,
          headerRowsText,
          bodyRows,
          bodyRowsText
        }
      },
      forEachRow: (callback, selectors, dbug = true) => {
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
      },
      getCellsIndexes: (tableTitles, tableHeaderRowSelector, cellSelector = 'th') => {
        const tableHeader = document.querySelectorAll(tableHeaderRowSelector + ' ' + cellSelector)
        if (tableHeader.length === 0) {
          throw new Error('No se encontraron celdas, selector: ' + tableHeaderRowSelector)
        }

        let siteTitles = []
        let resultsKeys = []

        if (Array.isArray(tableTitles)) {
          siteTitles = tableTitles
          resultsKeys = tableTitles
        } else {
          siteTitles = Object.keys(tableTitles)
          resultsKeys = Object.values(tableTitles)
        }

        if (siteTitles.length === 0 || resultsKeys.length === 0) return {}

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
      },
      getRepeatedRows: (rows, areEqualRows) => {
        if (typeof areEqualRows !== 'function' || !Array.isArray(rows)) {
          throw new Error('getRepeatedRows -> los argumentos no son válidos')
        }

        const allRepeatedRows = []

        rows.forEach((row, index) => {
          const rowRest = rows.slice(index + 1)

          if (rowRest.length === 0) return

          const repeatedRows = rowRest.filter(row2 => areEqualRows(row, row2))

          if (repeatedRows.length === 0) return

          const alreadyInRepeatedRows = allRepeatedRows.flat()
            .some(repeatedRow => areEqualRows(repeatedRow, row))

          if (!alreadyInRepeatedRows) {
            allRepeatedRows.push([row, ...repeatedRows])
          }
        })

        console.log('filas repetidas ->', allRepeatedRows)
        return allRepeatedRows
      },
      formatDateToUS: (date) => {
        const dateFormatter = new Intl.DateTimeFormat('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
        const dateToFormat = new Date(date)

        if (dateToFormat.toString() === 'Invalid Date' || typeof date !== 'string') {
          console.log('Error en formatDateToUS')
          throw new Error('Fecha invalida')
        }
        const formattedDate = dateFormatter.format(dateToFormat)
        return formattedDate
      },
      waitForDisplay: (element, maxTimeMS) => {
        if (!element || maxTimeMS < 3000) {
          return Promise.reject(new Error('waitForElement: Argumentos invalidos'))
        }
        // Retorna una promesa que espera que la propiedad display del elemento sea distinto None
        return new Promise((resolve, reject) => {
          // Se utilizan intervalos de tiempo de 500 ms
          // Cada 500 ms se comprobara si la propiedad display es distinto de None

          const intervalForDisplay = setInterval(() => {
            const computedStyle = window.getComputedStyle(element)
            const display = computedStyle.display

            if (display !== 'none') { // Salida del intervalo en caso de exito
              console.log('Elemento visible')
              clearInterval(intervalForDisplay)
              resolve()
            } else {
              console.log('Elemento no visible')
            }
            if (maxTimeMS <= 0) { // Salida del intervalo en caso de tiempo agotado
              console.log('Tiempo agotado')
              clearInterval(intervalForDisplay)
              reject(new Error('Tiempo agotado'))
            }
            maxTimeMS -= 500
          }, 500)
        })
      },
      waitForRerender: (element, elementEvent, maxTimeMS) => {
        if (!element || (typeof elementEvent !== 'string' || elementEvent === '') ||
        maxTimeMS < 3000) {
          return Promise.reject(new Error('waitForRerender: Argumentos invalidos'))
        }
        // Retorna una promesa que espera que la tabla tenga un cambio de renderizado
        return new Promise((resolve, reject) => {
          let status = false
          // Añadimos un eventlistener que escuche por el evento DOMNodeInserted y cambie el status cuando se ejecute
          const handleRender = () => {
            console.log('El elemento ha sido renderizado de nuevo')
            status = true
          }
          element.addEventListener('DOMNodeInserted', handleRender)
          element.dispatchEvent(new Event(elementEvent))
          // Se utilizan intervalos de tiempo de 500 ms
          // Cada 500 ms se comprobara si la tabla sufrio un nuevo renderizado
          const intervalForDisplay = setInterval(() => {
            if (status === true) { // Salida del intervalo en cado de exito
              console.log('Elemento renderizado!')
              clearInterval(intervalForDisplay)
              element.removeEventListener('DOMNodeInserted', handleRender)
              resolve()
            } else {
              console.log('Elemento aun no renderizado')
            }
            if (maxTimeMS <= 0) { // Salida del intervalo en caso de tiempo agotado
              console.log('Tiempo agotado')
              clearInterval(intervalForDisplay)
              element.removeEventListener('DOMNodeInserted', handleRender)
              reject(new Error('No se renderizo el elemento'))
            }
            maxTimeMS -= 500
          }, 500)
        })
      },
      fillFormInputs: (inputsData, inputEvent = 'input') => {
        const inputSelectors = Object.keys(inputsData)
        const inputValues = Object.values(inputsData)

        inputSelectors.forEach((inputSelector, selectorIndex) => {
          const input = document.querySelector(inputSelector)

          if (!input) {
            console.log('fillFormInputs')
            console.log(`No se encontro el input ${inputSelector}`)
            return
          }

          input.value = inputValues[selectorIndex]
          input.dispatchEvent(new Event(inputEvent))
        })
      },
      normalizeString: (stringToNormalize) =>
        stringToNormalize.toLocaleLowerCase().trim(),
      deepNormalizeString: (stringToNormalize, optionalNormalizer = undefined) => {
        let normalized = stringToNormalize.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
        normalized = normalized.toLocaleLowerCase().trim()
        if (optionalNormalizer) {
          normalized = optionalNormalizer(normalized)
        }
        return normalized
      }
    }
    return library
  }

  if (typeof window.dr === 'undefined') {
    window.dr = dr()
  }
})(window, document)
