import { Canvas, loadImage, NodeCanvasRenderingContext2D, registerFont } from 'canvas'

import { i18n } from '@/common/i18n'
import { getPaletteRange } from '@/common/utils/getPaletteRange'
import { lightTheme } from '@/configs/theme'
import { CourseThumbnailData } from '@/services/apollo/query/getCourse'

registerFont('public/fonts/Poppins-Bold.ttf', { family: 'Poppins Bold' })
registerFont('public/fonts/Prompt-Bold.ttf', { family: 'Prompt Bold' })
registerFont('public/fonts/Prompt-Medium.ttf', { family: 'Prompt Medium' })
const background = loadImage('public/thumbnailBackground.png')

const theme = lightTheme
const width = 1200
const height = 630

export async function drawThumbnail(
  canvas: Canvas,
  { courseNo, abbrName, courseNameTh, courseNameEn, genEdType }: CourseThumbnailData
) {
  const ctx = canvas.getContext('2d')

  ctx.drawImage(await background, 0, 0, width, height)

  drawText(ctx, courseNo, 64, 217, 'Poppins Bold', 36, theme.palette.primaryRange[100])
  drawText(ctx, abbrName, 64, 266, 'Poppins Bold', 60, theme.palette.primary.main)
  const abbrNameMetrics = ctx.measureText(abbrName)

  drawText(ctx, courseNameTh, 64, 372, 'Prompt Bold', 30, theme.palette.primary.main)
  drawText(ctx, courseNameEn, 64, 417, 'Poppins Bold', 30, theme.palette.primary.main)

  if (genEdType !== 'NO') {
    const genEdColor = getPaletteRange(theme, genEdType)[700]
    const genEdText = i18n.t(genEdType, { ns: 'courseThumbnail' })
    drawText(ctx, genEdText, 64 + abbrNameMetrics.width + 57, 288, 'Prompt Medium', 24, genEdColor)

    const genEdMetrics = ctx.measureText(genEdText)
    drawRoundRect(ctx, 64 + abbrNameMetrics.width + 27, 285, genEdMetrics.width + 60, 40, 24)
    ctx.strokeStyle = genEdColor
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.fillStyle = genEdColor
    ctx.fillRect(0, height - 56, width, 56)
  }
}

function drawText(
  ctx: NodeCanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  size: number,
  color: string
) {
  ctx.font = `${size}px "${font}"`
  ctx.fillStyle = color

  ctx.fillText(text, x, y + size)
}

function drawRoundRect(ctx: NodeCanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2)
  r = Math.min(r, h / 2)

  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
