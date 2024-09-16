<script lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui'

  import { cn } from '../../../utils'

  type $$Props = SelectPrimitive.TriggerProps
  type $$Events = SelectPrimitive.TriggerEvents

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<SelectPrimitive.Trigger
  class="{cn(
    'border-input bg-background ring-offset-background focus-visible:ring-ring aria-[invalid]:border-destructive data-[placeholder]:[&>span]:text-muted-foreground flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
    className,
  )}"
  {...$$restProps}
  let:builder
  on:click
  on:keydown
>
  <div class="flex flex-row space-y-0 space-x-2">
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      class="relative top-1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6666 13V11.6667C10.6666 10.9594 10.3856 10.2811 9.88554 9.78105C9.38544 9.28095 8.70716 9 7.99992 9H3.99992C3.29267 9 2.6144 9.28095 2.1143 9.78105C1.6142 10.2811 1.33325 10.9594 1.33325 11.6667V13M8.66659 3.66667C8.66659 5.13943 7.47268 6.33333 5.99992 6.33333C4.52716 6.33333 3.33325 5.13943 3.33325 3.66667C3.33325 2.19391 4.52716 1 5.99992 1C7.47268 1 8.66659 2.19391 8.66659 3.66667Z"
        stroke="#898EA7"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
    <slot {builder} />
  </div>

  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L5 5L9 1"
      stroke="#898EA7"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
</SelectPrimitive.Trigger>
