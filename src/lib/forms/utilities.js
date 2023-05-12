
export function fillFormInputs (inputsData, inputEvent = 'input') {
  const inputSelectors = Object.keys(inputsData)
  const inputValues = Object.values(inputsData)

  inputSelectors.forEach((inputSelector, selectorIndex) => {
    const input = document.querySelector(inputSelector)

    if (!input) return

    input.value = inputValues[selectorIndex]
    input.dispatchEvent(new Event(inputEvent))
  })
}
