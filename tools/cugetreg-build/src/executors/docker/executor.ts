import type { ExecutorContext } from '@nrwl/devkit'
import child_process from 'child_process'
import fs from 'fs/promises'
import { Readable } from 'stream'
import { create as createTar } from 'tar'

import { getSourceProjectRoots } from '../../utils/getSourceProjectRoots'

const excludedPaths = new Set([
  '.git',
  'node_modules',
  'build',
  'apps',
  'dist',
  'libs',
  'tmp',
  'tools',
])

export default async function dockerExecutor(
  _options: never,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  console.info(`Starting build...`)

  const availableProjects = Object.keys(context.workspace.projects)

  const target = context.projectName
  const targetRoot = context.workspace.projects[target].root
  const projectRoots = getSourceProjectRoots(target, availableProjects)

  const allPaths = await fs.readdir(context.root)
  const filteredPaths = allPaths.filter((path) => !excludedPaths.has(path))
  const paths = [...filteredPaths, ...projectRoots]

  const tar = createTar({ gzip: true }, paths)

  const dockerfile = `${targetRoot}/Dockerfile`
  await exec(
    `docker buildx build --load -f "${dockerfile}" --tag "${context.projectName}:latest" -`,
    tar
  )

  return { success: true }
}

function exec(command: string, stdin?: Readable): Promise<void> {
  console.log(`Running ${command}`)
  return new Promise((resolve, reject) => {
    const child = child_process.exec(command)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command ${command} exited with code ${code}`))
      }
    })
    stdin?.pipe(child.stdin)
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
  })
}
