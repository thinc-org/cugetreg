import type { HTMLInputAttributes } from 'svelte/elements'
import { tv, type VariantProps } from 'tailwind-variants'

import Root from './input.svelte'

export type FormInputEvent<T extends Event = Event> = T & {
  currentTarget: EventTarget & HTMLInputElement
}

const inputVariants = tv({
  base: 'flex w-full h-10 rounded-button border-none px-4 text-button2 placeholder:text-on-surface hover:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-container-lowest disabled:border-none disabled:ring-0 disabled:placeholder:text-on-surface-disabled',
  variants: {
    state: {
      default:
        'bg-surface-container-lowest hover:ring-primary hover:ring-1 focus-visible:ring-1.5 focus-visible:ring-primary',
      error: 'ring-error ring-1.5',
      success: 'ring-success ring-1.5',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

export type InputEvents = {
  blur: FormInputEvent<FocusEvent>
  change: FormInputEvent<Event>
  click: FormInputEvent<MouseEvent>
  focus: FormInputEvent<FocusEvent>
  focusin: FormInputEvent<FocusEvent>
  focusout: FormInputEvent<FocusEvent>
  keydown: FormInputEvent<KeyboardEvent>
  keypress: FormInputEvent<KeyboardEvent>
  keyup: FormInputEvent<KeyboardEvent>
  mouseover: FormInputEvent<MouseEvent>
  mouseenter: FormInputEvent<MouseEvent>
  mouseleave: FormInputEvent<MouseEvent>
  mousemove: FormInputEvent<MouseEvent>
  paste: FormInputEvent<ClipboardEvent>
  input: FormInputEvent<InputEvent>
  wheel: FormInputEvent<WheelEvent>
}

type State = VariantProps<typeof inputVariants>['state']

type Props = HTMLInputAttributes & {
  state?: State
}

type Events = InputEvents

export { type Events, Root as Input, inputVariants, type Props }
