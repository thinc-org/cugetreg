<script lang="ts">
  import { cn } from '../../utils'
  import { type Events, inputVariants, type Props } from './index.js'
  import * as Select from './index.js'

  type $$Props = Props
  type $$Events = Events

  let className: $$Props['class'] = undefined
  export let desc: $$Props['desc'] = ''
  export let placeholder: $$Props['placeholder'] = 'none'
  export let state: $$Props['state'] = 'default'
  export let items: $$Props['items'] = []

  export { className as class }

  // Workaround for https://github.com/sveltejs/svelte/issues/9305
  // Fixed in Svelte 5, but not backported to 4.x.
  const disabled = state === 'disable'
</script>

<div class="space-y-2 text-button2">
  <Select.Root>
    <Select.Trigger
      {disabled}
      class="{cn(className, inputVariants({ state }))}"
    >
      <Select.Value {placeholder} />
    </Select.Trigger>
    <Select.Content>
      {#each items as item}
        <Select.Item value="{item}">{item}</Select.Item>
      {/each}
    </Select.Content>
    <p
      class="{state == 'error'
        ? 'text-error'
        : state == 'success'
          ? 'text-success'
          : state == 'disable'
            ? 'text-neutral-300'
            : 'text-neutral-400'}"
    >
      {desc}
    </p>
  </Select.Root>
</div>
