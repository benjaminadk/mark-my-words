export const readTime = words => {
  const time = Math.ceil(words / 300)
  return `Read Time: ${time} min`
}
