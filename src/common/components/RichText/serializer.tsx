import escapeHtml from 'escape-html'
import { Text, Element, Descendant } from 'slate'

import {
  RichTextBlockType,
  RichTextMarkType,
  RichTextBlockTag,
  RichTextMarkTag,
} from '@/common/components/RichText/types'

class serializer {
  serialize(node: Descendant[] | Descendant): string {
    if (Text.isText(node)) {
      return this.serializeText(node)
    }
    let children = ''
    if (Array.isArray(node)) {
      children = node.map((n) => this.serialize(n as any)).join('')
    }
    if (Element.isElement(node)) {
      children = node.children.map((n) => this.serialize(n as any)).join('')
      return this.serializeElement(node, children)
    }
    return children
  }

  private serializeText(node: Text): string {
    let text = escapeHtml(node.text)
    if (node[RichTextMarkType.BOLD]) text = this.generateTag(RichTextMarkTag.BOLD, text)
    if (node[RichTextMarkType.ITALIC]) text = this.generateTag(RichTextMarkTag.ITALIC, text)
    if (node[RichTextMarkType.UNDERLINE]) text = this.generateTag(RichTextMarkTag.UNDERLINE, text)
    if (node[RichTextMarkType.STRIKETHROUGH]) text = this.generateTag(RichTextMarkTag.STRIKETHROUGH, text)
    if (node[RichTextMarkType.CODE]) text = this.generateTag(RichTextMarkTag.CODE, text)
    return text
  }

  private serializeElement(node: Element, children: string): string {
    switch (node.type) {
      case RichTextBlockType.PARAGRAPH:
        return this.generateTag(RichTextBlockTag.PARAGRAPH, children)
      case RichTextBlockType.HEADING:
        return this.generateTag(RichTextBlockTag.HEADING, children)
      case RichTextBlockType.SUB_HEADING:
        return this.generateTag(RichTextBlockTag.SUB_HEADING, children)
      case RichTextBlockType.BLOCK_QUOTE:
        return this.generateTag(RichTextBlockTag.BLOCK_QUOTE, children)
      case RichTextBlockType.ORDER_LIST:
        return this.generateTag(RichTextBlockTag.ORDER_LIST, children)
      case RichTextBlockType.UNORDER_LIST:
        return this.generateTag(RichTextBlockTag.UNORDER_LIST, children)
      case RichTextBlockType.LIST_ITEM:
        return this.generateTag(RichTextBlockTag.LIST_ITEM, children)
      default:
        return children
    }
  }

  deserialize(element: HTMLElement | ChildNode | string): any {
    if (typeof element === 'string') {
      const document = new DOMParser().parseFromString(element, 'text/html')
      return this.deserialize(document.body)
    }

    if (element.nodeType === Node.TEXT_NODE) {
      return { text: element.textContent }
    } else if (element.nodeType !== Node.ELEMENT_NODE) {
      return
    }

    let children = Array.from(element.childNodes).map((child) => {
      if (Object.values(RichTextMarkTag).includes(child.nodeName.toLocaleLowerCase())) {
        return this.deserializeTextNode(child)
      }
      return this.deserialize(child)
    })

    if (children.length === 0) {
      children = [{ text: '' }]
    }

    switch (element.nodeName.toLowerCase()) {
      /**
       * The top parent of parseFromString is body
       */
      case 'body':
        return children
      case RichTextBlockTag.PARAGRAPH:
        return { type: RichTextBlockType.PARAGRAPH, children }
      case RichTextBlockTag.HEADING:
        return { type: RichTextBlockType.HEADING, children }
      case RichTextBlockTag.SUB_HEADING:
        return { type: RichTextBlockType.SUB_HEADING, children }
      case RichTextBlockTag.BLOCK_QUOTE:
        return { type: RichTextBlockType.BLOCK_QUOTE, children }
      case RichTextBlockTag.ORDER_LIST:
        return { type: RichTextBlockType.ORDER_LIST, children }
      case RichTextBlockTag.UNORDER_LIST:
        return { type: RichTextBlockType.UNORDER_LIST, children }
      case RichTextBlockTag.LIST_ITEM:
        return { type: RichTextBlockType.LIST_ITEM, children }
      default:
        return element.textContent
    }
  }

  private deserializeTextNode(node: ChildNode | null) {
    if (!node) return
    if (node.nodeType === Node.TEXT_NODE) {
      return { text: node.textContent }
    }
    let leaf: any = { text: '' }
    if (node.nodeName === 'B') {
      leaf = { [RichTextMarkType.BOLD]: true, ...leaf }
    }
    if (node.nodeName === 'EM') {
      leaf = { [RichTextMarkType.ITALIC]: true, ...leaf }
    }
    if (node.nodeName === 'U') {
      leaf = { [RichTextMarkType.UNDERLINE]: true, ...leaf }
    }
    if (node.nodeName === 'S') {
      leaf = { [RichTextMarkType.STRIKETHROUGH]: true, ...leaf }
    }
    if (node.nodeName === 'CODE') {
      leaf = { [RichTextMarkType.CODE]: true, ...leaf }
    }
    leaf = { ...leaf, ...this.deserializeTextNode(node.firstChild) }
    return leaf
  }

  private generateTag(mark: RichTextMarkTag | RichTextBlockTag, text: string): string {
    return `<${mark}>${text}</${mark}>`
  }
}

const instance = new serializer()
export { instance as serializer }
