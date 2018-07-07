export const copy = text => {
  let range = document.createRange()
  let selection = document.getSelection()
  let el = document.createElement('span')
  el.textContent = text
  document.body.appendChild(el)
  range.selectNode(el)
  selection.addRange(range)
  document.execCommand('copy')
  document.body.removeChild(el)
}
