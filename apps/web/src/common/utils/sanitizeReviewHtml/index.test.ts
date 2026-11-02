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

  it('rejects a long whitespace-padded style without catastrophic backtracking', () => {
    const html = `<p style="margin-left:1px${' '.repeat(100_000)}x">a</p>`
    const start = performance.now()
    expect(sanitizeReviewHtml(html)).toBe('<p>a</p>')
    expect(performance.now() - start).toBeLessThan(1000)
  })

  it('keeps margin-left with trailing whitespace after the semicolon', () => {
    expect(sanitizeReviewHtml('<p style="margin-left: 1.5em ;  ">x</p>')).toBe(
      '<p style="margin-left: 1.5em ;">x</p>'
    )
  })
})
