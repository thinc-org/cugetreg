import fs from 'fs/promises'
import path from 'path'

export async function getCachedImage(dir: string, key: string, createImage: () => Promise<Buffer>): Promise<Buffer> {
  const cacheDir = path.resolve('./cache', dir)
  await fs.mkdir(cacheDir, { recursive: true })
  const cacheFile = path.resolve(cacheDir, key)
  if (!(await exists(cacheFile))) {
    const imageBuffer = await createImage()
    await fs.writeFile(cacheFile, imageBuffer)
    return imageBuffer
  }
  return fs.readFile(cacheFile)
}

async function exists(file: string): Promise<boolean> {
  try {
    await fs.stat(file)
    return true
  } catch (e) {
    return false
  }
}
