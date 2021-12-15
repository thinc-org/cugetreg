import type { TNode } from '@udecode/plate-core'
import escapeHTML from 'escape-html'

/**
 * Convert some syntax to escaped html. For example ">" to "&gt". To prevent XSS attack from user's review input
 * @param value - Plate's TNode
 * @returns
 */
export function applyEscapedText(value: TNode[] | null): TNode[] {
  if (!value) return []
  const html = value.map((node: TNode) => {
    if (node.type) return { ...node, children: applyEscapedText(node.children) }
    return { ...node, text: escapeHTML(node.text) }
  }, true)
  return html
}

export function scrollToReviewForm() {
  const reviewTitle = document.getElementById('review-title')
  if (reviewTitle) {
    const offset = 124 + 16
    const offsetTop = reviewTitle.offsetTop
    window.scrollTo({ top: offsetTop - offset, behavior: 'smooth' })
  }
}
