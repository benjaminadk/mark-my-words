export const copy = text => {
  let el = document.createElement('span')
  el.textContent = text
  document.body.appendChild(el)
  document.execCommand('copy')
  document.body.removeChild(el)
}
