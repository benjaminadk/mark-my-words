export const readTime = words => {
  const time = Math.ceil(words / 250)
  return `Read Time: ${time} min`
}
