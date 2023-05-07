export function waitForDisplay (element) {
  let maxTimeMS = 10000 // Tiempo maximo 10s

  // Retorna una promesa que espera que la propiedad display del elemento sea distinto None
  return new Promise((resolve, reject) => {
    // Se utilizan intervalos de tiempo de 500 ms
    // Cada 500 ms se comprobara si la propiedad display es distinto de None

    const intervalForDisplay = setInterval(() => {
      const computedStyle = window.getComputedStyle(element)
      const display = computedStyle.display

      if (display !== 'none' && display !== 'hidden') { // Salida del intervalo en caso de exito
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
}

export function waitForNodeInserted (element, elementEvent) {
  let maxTimeMS = 10000 // Tiempo maximo 10s

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
        console.log('Tabla renderizada')
        clearInterval(intervalForDisplay)
        element.removeEventListener('DOMNodeInserted', handleRender)
        resolve()
      } else {
        console.log('Tabla aun no renderizada')
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
}
