import { Descendant } from 'slate'

import { serializer } from './serializer'

describe('RichText serializer', () => {
  const mockDeserialize = [
    {
      type: 'heading',
      children: [
        {
          text: 'วันนี้อากาศเป็นอย่างไรบ้าง?',
        },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text: 'อาจจารย์สอนให้ใช้ ',
        },
        {
          code: true,
          text: 'print("Hello New World")',
        },
        {
          text: 'ในวิชา Python',
        },
      ],
    },
    {
      type: 'order list',
      children: [
        {
          type: 'list',
          children: [
            {
              text: 'วันนี้อากาศดี',
            },
          ],
        },
        {
          type: 'list',
          children: [
            {
              text: 'วันนี้',
            },
            {
              text: 'อากาศ',
              'strike through': true,
            },
            {
              text: 'ไม่ดี',
            },
          ],
        },
        {
          type: 'list',
          children: [
            {
              text: 'วันนี้อากาศดี',
              italic: true,
            },
          ],
        },
      ],
    },
    {
      type: 'unorder list',
      children: [
        {
          type: 'list',
          children: [
            {
              text: 'วันนี้',
            },
            {
              text: 'อาหาร',
              bold: true,
            },
            {
              text: 'อร่อย',
            },
          ],
        },
        {
          type: 'list',
          children: [
            {
              text: 'NICE',
            },
          ],
        },
      ],
    },
    {
      type: 'block quote',
      children: [
        {
          text: "For 50 years, WWF has been protecting the future of nature. The world's leading conservation organization, WWF works in 100 countries and is supported by 1.2 million members in the United States and close to 5 million globally.",
        },
      ],
    },
    {
      type: 'block quote',
      children: [
        {
          text: 'โทมัสได้กล่าวไว้ว่า',
        },
      ],
    },
  ] as Descendant[]

  const mockSerialize = [
    '<h1>วันนี้อากาศเป็นอย่างไรบ้าง?</h1>',
    '<p>อาจจารย์สอนให้ใช้ <code>print(&quot;Hello New World&quot;)</code>ในวิชา Python</p>',
    '<ol><li>วันนี้อากาศดี</li><li>วันนี้<s>อากาศ</s>ไม่ดี</li><li><i>วันนี้อากาศดี</i></li></ol>',
    '<ul><li>วันนี้<b>อาหาร</b>อร่อย</li><li>NICE</li></ul>',
    '<blockquote>For 50 years, WWF has been protecting the future of nature. The world&#39;s leading conservation organization, WWF works in 100 countries and is supported by 1.2 million members in the United States and close to 5 million globally.</blockquote>',
    '<blockquote>โทมัสได้กล่าวไว้ว่า</blockquote>',
  ].join('')

  it('should serialize correctly', () => {
    expect(serializer.serialize(mockDeserialize)).toBe(mockSerialize)
  })

  it('should deserialize correctly', () => {
    expect(serializer.deserialize(mockSerialize)).toEqual(mockDeserialize)
  })
})
