import fs from 'fs/promises'
import os from 'os'
import path from 'path'

const cacheDir = path.join(os.tmpdir(), 'cugetreg')

export async function getCachedImage(key: string, createImage: () => Promise<Buffer>): Promise<Buffer> {
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
