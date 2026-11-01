import DOMPurify from 'isomorphic-dompurify'

// Only the markup the review editor (RichTextEditor) emits. Review content is user-supplied raw
// HTML, and DOMPurify's default profile still allows <style>, forms, images and links.
// Keep in sync with apps/admin-web/src/common/sanitizeReviewHtml.
const ALLOWED_TAGS = [
  'p',
  'div',
  'span',
  'br',
  'h1',
  'blockquote',
  'ul',
  'ol',
  'li',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'del',
  'code',
]
const ALLOWED_ATTR = ['class', 'style']
// The indent plugin's margin-left is the only inline style the editor produces.
const ALLOWED_STYLE = /^\s*margin-left\s*:\s*\d+(\.\d+)?(px|em|rem)\s*;?\s*$/i

const filterStyle: Parameters<typeof DOMPurify.addHook>[1] = (_node, data) => {
  if (data.attrName === 'style' && !ALLOWED_STYLE.test(data.attrValue)) {
    data.keepAttr = false
  }
}

export function sanitizeReviewHtml(html: string): string {
  DOMPurify.addHook('uponSanitizeAttribute', filterStyle)
  try {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
  } finally {
    DOMPurify.removeHook('uponSanitizeAttribute')
  }
}
