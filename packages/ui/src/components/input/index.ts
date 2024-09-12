import type { HTMLInputAttributes } from 'svelte/elements'
import { tv, type VariantProps } from 'tailwind-variants'

import Root from './input.svelte'

export type FormInputEvent<T extends Event = Event> = T & {
  currentTarget: EventTarget & HTMLInputElement
}

const inputVariants = tv({
  base: 'flex w-full max-w-[225px] h-10 rounded-button bg-surface-container-lowest px-4 text-button2 placeholder:text-on-surface hover:outline-none hover:ring-1 hover:ring-primary focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-primary disabled:cursor-not-allowed placeholder:disabled:text-on-surface-disabled disabled:hover:ring-0',
  variants: {
    color: {
      primary: 'hover:ring-primary focus-visible:ring-primary',
      error: 'ring-error focus-visible:ring-error',
      success: 'ring-success focus-visible:ring-success',
    },
    state: {
      default: '',
      error: 'ring-error',
      success: 'ring-success',
    },
  },
  defaultVariants: {
    color: 'primary',
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

type Variant = VariantProps<typeof inputVariants>['color']
type State = VariantProps<typeof inputVariants>['state']

type Props = HTMLInputAttributes & {
  color?: Variant
  state?: State
  label?: string
  desc?: string
}

type Events = InputEvents

export { type Events, Root as Input, inputVariants, type Props }
