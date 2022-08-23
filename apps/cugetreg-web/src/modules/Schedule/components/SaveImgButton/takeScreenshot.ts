export async function takeScreenshot(node: HTMLElement | null) {
  if (!node) {
    throw new Error('You should provide correct html node.')
  }
  const { default: html2canvas } = await import('html2canvas')
  const canvas = await html2canvas(node)
  const croppedCanvas = document.createElement('canvas')
  const croppedCanvasContext = croppedCanvas.getContext('2d')
  if (croppedCanvasContext === null) {
    throw new Error('Canvas context is null')
  }

  // init data
  const cropPositionTop = 0
  const cropPositionLeft = 0
  const cropWidth = canvas.width
  const cropHeight = canvas.height

  croppedCanvas.width = cropWidth
  croppedCanvas.height = cropHeight

  croppedCanvasContext.drawImage(canvas, cropPositionLeft, cropPositionTop)

  return croppedCanvas.toDataURL()
}
