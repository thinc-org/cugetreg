import type { HTMLInputAttributes } from 'svelte/elements'
import { tv, type VariantProps } from 'tailwind-variants'

import Root from './input.svelte'

export type FormInputEvent<T extends Event = Event> = T & {
  currentTarget: EventTarget & HTMLInputElement
}

const inputVariants = tv({
  base: 'flex w-full max-w-[250px] h-10 rounded-button border-2 px-4 text-button',
  variants: {
    state: {
      default:
        'border-none bg-surface-container-lowest hover:ring-primary placeholder:text-on-surface hover:outline-none hover:ring-1 focus-visible:outline-none focus-visible:ring-2',
      error:
        'border-error ring-error bg-red-200 placeholder:text-on-surface ring-1.5 hover:outline-none focus-visible:outline-none',
      success:
        'border-success ring-success ring-1.5 focus-visible:outline-none hover:outline-none',
      disable:
        'bg-gray-200 border-none focus-visible:outline-none cursor-not-allowed ring-0 placeholder:text-on-surface-disabled placeholder:pointer-events-none',
    },
  },
  defaultVariants: {
    color: 'primary',
    state: 'default',
  },
})

export type InputEvents = {
  // blur: FormInputEvent<FocusEvent>
  change: FormInputEvent<Event>
  click: FormInputEvent<MouseEvent>
  focus: FormInputEvent<FocusEvent>
  // focusin: FormInputEvent<FocusEvent>
  // focusout: FormInputEvent<FocusEvent>
  // keydown: FormInputEvent<KeyboardEvent>
  // keypress: FormInputEvent<KeyboardEvent>
  // keyup: FormInputEvent<KeyboardEvent>
  // mouseover: FormInputEvent<MouseEvent>
  // mouseenter: FormInputEvent<MouseEvent>
  // mouseleave: FormInputEvent<MouseEvent>
  // mousemove: FormInputEvent<MouseEvent>
  // paste: FormInputEvent<ClipboardEvent>
  // input: FormInputEvent<InputEvent>
  // wheel: FormInputEvent<WheelEvent>
}

type State = VariantProps<typeof inputVariants>['state']

type Props = HTMLInputAttributes & {
  state?: State
  label?: string
  desc?: string
}

type Events = InputEvents

export { type Events, Root as Input, inputVariants, type Props }
