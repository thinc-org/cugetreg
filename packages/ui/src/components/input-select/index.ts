import type { HTMLInputAttributes } from 'svelte/elements'
import { tv, type VariantProps } from 'tailwind-variants'

import Root from './input-select.svelte'

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
  change: FormInputEvent<Event>
  click: FormInputEvent<MouseEvent>
  focus: FormInputEvent<FocusEvent>
}

type State = VariantProps<typeof inputVariants>['state']

type Props = HTMLInputAttributes & {
  state?: State
  label?: string
  desc?: string
  items?: string[]
}

type Events = InputEvents

export { type Events, inputVariants, type Props, Root as Select }
