export async function withTimeLog<T>(name: string, fn: () => Promise<T>) {
  const start = performance.now()

  const returnVal = await fn()

  console.log(`[${name}] took: ${performance.now() - start} ms`)

  return returnVal
}
