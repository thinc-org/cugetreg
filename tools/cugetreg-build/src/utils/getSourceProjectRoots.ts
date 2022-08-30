import type { ProjectGraphDependency } from '@nrwl/devkit'
import { readCachedProjectGraph } from '@nrwl/devkit'
import path from 'path'

export function getSourceProjectRoots(target: string, availableProjects: string[]): string[] {
  const projectGraph = readCachedProjectGraph()
  const nodes = new Set(availableProjects)

  const outNodes = new Set<string>()
  traverseDepsGraph(projectGraph.dependencies, target, nodes, outNodes)

  const projects = Array.from(outNodes)
  const projectRoots = projects.map((project) => projectGraph.nodes[project].data.root)
  const projectJsons = availableProjects
    .filter((project) => !outNodes.has(project))
    .map((project) => projectGraph.nodes[project].data.root)
    .map((projectRoot) => path.join(projectRoot, 'project.json'))

  return [...projectRoots, ...projectJsons]
}

function traverseDepsGraph(
  allDeps: Record<string, ProjectGraphDependency[]>,
  currentNode: string,
  allowedNodes: Set<string>,
  outNodes: Set<string>
) {
  outNodes.add(currentNode)
  const deps = allDeps[currentNode] || []
  for (const dep of deps) {
    const nextNode = dep.target
    if (!allowedNodes.has(nextNode)) continue
    if (outNodes.has(nextNode)) continue
    traverseDepsGraph(allDeps, nextNode, allowedNodes, outNodes)
  }
}
