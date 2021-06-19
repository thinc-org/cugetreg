// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createMacro } = require('babel-plugin-macros')

module.exports = createMacro(envMacros)

function findOuterMostParent(referencePath) {
  let current = referencePath
  while (current.parentPath && current.parentPath.isMemberExpression()) {
    current = current.parentPath
  }
  return current
}

function flattenName(node, onError) {
  const properties = []
  while (node.type === 'MemberExpression') {
    if ((node.computed && node.property.type === 'StringLiteral') || node.property.type === 'NumericLiteral') {
      properties.unshift(node.property.value)
    } else if (!node.computed) {
      properties.unshift(node.property.name)
    } else {
      onError(`cannot use dynamic property names`)
    }
    node = node.object
  }
  return properties.join('_')
}

function envMacros({ references, state, babel }) {
  references.default.map((referencePath) => {
    function onError(msg) {
      unsupportedError(referencePath, babel, msg)
    }

    const parent = findOuterMostParent(referencePath)
    if (!parent.isMemberExpression()) {
      onError('you have to reference members of env')
    }
    const envName = flattenName(parent.node, onError)
    parent.replaceWith(importNamed({ state, babel }, '@/utils/env', envName))
  })
}

function importNamed({ state, babel }, source, name) {
  const t = babel.types
  const program = state.file.path

  const createId = () => program.scope.generateUidIdentifier(name)
  const createImport = (id) => t.importSpecifier(id, t.identifier(name))

  const importPath = program.get('body').find((path) => path.isImportDeclaration() && path.node.source.value === source)
  if (importPath) {
    const specifier = importPath.node.specifiers.find((specifier) => specifier.imported.name === name)
    if (specifier) {
      return specifier.local
    } else {
      const id = createId()
      importPath.node.specifiers.unshift(createImport(id))
      return id
    }
  }
  const id = createId()
  program.node.body.unshift(t.importDeclaration([createImport(id)], t.stringLiteral(source)))
  return id
}

function unsupportedError(reference, babel, message) {
  throw new Error(
    `This is not supported: \`${reference.findParent(babel.types.isExpression).getSource()}\`. ${message}`
  )
}
