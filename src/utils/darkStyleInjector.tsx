import { ReactNode } from 'react'

interface ChangedLine {
  line: number
  newValue: string
}

function generateDarkModeScript(changes: ChangedLine[]) {
  return `
    (function() {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        var s = document.querySelector('#jss-server-side')
        var l = s.innerText.split('\\n')
        ${changes
          .map(
            (change) => `l[${change.line}] = ${JSON.stringify(change.newValue)}`
          )
          .join('\n')}
        s.innerText = l.join('\\n')
      }
    })()
`
}

export function injectDarkStyle(
  lightStyle: string,
  darkStyle: string
): ReactNode {
  const lightLines = lightStyle.split('\n')
  const darkLines = darkStyle.split('\n')
  if (lightLines.length !== darkLines.length) {
    throw new Error('mismatched style sheets line count')
  }

  const length = lightLines.length
  const changedLines: ChangedLine[] = []
  for (let i = 0; i < length; i++) {
    const light = lightLines[i]
    const dark = darkLines[i]
    if (light === dark) continue

    const lci = light.indexOf(':')
    const dci = light.indexOf(':')
    if (lci !== dci || lci === -1) {
      throw new Error('mismatched property name')
    }
    if (light.slice(0, lci) !== dark.slice(0, lci)) {
      throw new Error('mismatched property name')
    }
    changedLines.push({
      line: i,
      newValue: dark.trim(),
    })
  }

  const darkModeScript = generateDarkModeScript(changedLines)

  return (
    <>
      <style
        id="jss-server-side"
        dangerouslySetInnerHTML={{ __html: lightStyle }}
      />
      <script
        id="cgr-dark"
        dangerouslySetInnerHTML={{ __html: darkModeScript }}
      />
    </>
  )
}
