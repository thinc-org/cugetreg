import { Select as SelectPrimitive } from 'bits-ui'

import Content from './select-content.svelte'
import Item from './select-item.svelte'
import Label from './select-label.svelte'
import Separator from './select-separator.svelte'
import Trigger from './select-trigger.svelte'
import RootSelect from './select.svelte'

import type { HTMLInputAttributes } from 'svelte/elements'
import { tv, type VariantProps } from 'tailwind-variants'

const Root = SelectPrimitive.Root
const Group = SelectPrimitive.Group
const Input = SelectPrimitive.Input
const Value = SelectPrimitive.Value

const inputVariants = tv({
  base: 'flex w-full max-w-[250px] h-10 rounded-button border-2 px-4 text-button',
  variants: {
    state: {
      default:
        'border-none bg-surface-container-lowest hover:ring-primary placeholder:text-on-surface hover:outline-none hover:ring-1 focus-visible:outline-none focus-visible:ring-2',
      error:
        'border-error ring-error placeholder:text-on-surface ring-1.5 hover:outline-none focus-visible:outline-none',
      success:
        'border-success ring-success ring-1.5 focus-visible:outline-none hover:outline-none',
      disable:
        'bg-surface-container-lowest border-none focus-visible:outline-none cursor-not-allowed ring-0 placeholder:text-on-surface-disabled placeholder:pointer-events-none',
    },
  },
  defaultVariants: {
    color: 'primary',
    state: 'default',
  },
})

type State = VariantProps<typeof inputVariants>['state']

type Props = HTMLInputAttributes & {
  state?: State
  placeholder?: string
  items?: string[]
}

type Events = InputEvents

export {
  Content,
  Group,
  Input,
  Item,
  Label,
  Root,
  //
  Root as Select,
  Content as SelectContent,
  Group as SelectGroup,
  Input as SelectInput,
  Item as SelectItem,
  Label as SelectLabel,
  Separator as SelectSeparator,
  Trigger as SelectTrigger,
  Value as SelectValue,
  Separator,
  Trigger,
  Value,
}

export type FormInputEvent<T extends Event = Event> = T & {
  currentTarget: EventTarget & HTMLInputElement
}

export type InputEvents = {
  change: FormInputEvent<Event>
  click: FormInputEvent<MouseEvent>
  focus: FormInputEvent<FocusEvent>
}

export { type Events, inputVariants, type Props, RootSelect as InputSelect }
