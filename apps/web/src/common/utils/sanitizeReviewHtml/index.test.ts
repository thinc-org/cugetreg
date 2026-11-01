import { describe, expect, it } from 'vitest'

import { sanitizeReviewHtml } from '.'

describe('sanitizeReviewHtml', () => {
  it('keeps editor markup and indent', () => {
    const html =
      '<div class="slate-p" style="margin-left: 24px;"><strong>a</strong><em>b</em><code class="slate-code">c</code></div><ul><li>d</li></ul><blockquote>e</blockquote><h1>f</h1>'
    expect(sanitizeReviewHtml(html)).toBe(html)
  })

  it('drops style tags, forms, images and links', () => {
    const html =
      '<p>ok</p><style>body{display:none}</style><form action="https://x"><input name="p"></form><img src="https://x/a.png"><a href="https://x">y</a>'
    expect(sanitizeReviewHtml(html)).toBe('<p>ok</p>y')
  })

  it('drops inline styles other than margin-left', () => {
    expect(sanitizeReviewHtml('<p style="position:fixed;inset:0">x</p>')).toBe('<p>x</p>')
    expect(sanitizeReviewHtml('<p style="margin-left: 24px; position: fixed">x</p>')).toBe(
      '<p>x</p>'
    )
  })
})
