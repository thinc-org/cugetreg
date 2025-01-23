<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { Chip } from '../../atom/chip/index.js'
  import * as Select from './index.js'

  const { Story } = defineMeta<typeof Select.Root>({
    title: 'Molecule/Select',
    tags: ['autodocs'],
    argTypes: {
      value: {
        control: 'text',
        description: 'Currently selected value.',
      },
      disabled: {
        control: 'boolean',
        defaultValue: false,
        description: 'Disables the component.',
      },
      type: {
        control: {
          type: 'select',
        },
        options: ['single', 'multiple'],
        defaultValue: 'single',
        description: 'Selection mode: single or multiple.',
      },
      name: {
        control: 'text',
        description: 'Name attribute for forms.',
      },
    },
  })

  const fruits = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'grapes', label: 'Grapes' },
    { value: 'pineapple', label: 'Pineapple' },
  ]

  let value = $state('')

  const triggerContent = $derived(
    fruits.find((f) => f.value === value)?.label ?? 'Select a fruit',
  )

  const themes = [
    { value: '1', label: 'เซค 1' },
    { value: '2', label: 'เซค 2' },
    { value: '3', label: 'เซค 3' },
    { value: '4', label: 'เซค 4' },
    { value: '5', label: 'เซค 5' },
    { value: '6', label: 'เซค 6' },
  ]

  let value2 = $state<string[]>([])
</script>

<!--👇 Each story then reuses that template-->

<Story name="Default">
  <Select.Root type="single" name="favoriteFruit" bind:value>
    <Select.Trigger
      aria-label="Select your favorite fruit"
      class="w-[180px]"
      placeholder="Select a fruit"
    >
      {triggerContent}
    </Select.Trigger>
    <Select.Content role="listbox">
      <Select.Group>
        <Select.GroupHeading>Fruits</Select.GroupHeading>
        {#each fruits as fruit}
          <Select.Item
            value={fruit.value}
            label={fruit.label}
            aria-label={fruit.label}
            role="option"
          >
            {fruit.label}
          </Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>
</Story>

<Story name="Disabled">
  <Select.Root type="single" name="favoriteFruit" disabled bind:value>
    <Select.Trigger
      aria-label="Select your favorite fruit"
      class="w-[180px]"
      placeholder="Disabled"
    >
      {triggerContent}
    </Select.Trigger>
    <Select.Content role="listbox">
      <Select.Group>
        <Select.GroupHeading>Fruits</Select.GroupHeading>
        {#each fruits as fruit}
          <Select.Item
            value={fruit.value}
            label={fruit.label}
            aria-label={fruit.label}
            role="option"
          >
            {fruit.label}
          </Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>
</Story>

<Story name="Multiple Select">
  <Select.Root type="multiple" name="favoriteFruit" bind:value={value2}>
    <Select.Trigger
      aria-label="Select multiple fruits"
      class="w-[300px] h-12 z-0"
      placeholder="Select fruits"
    >
      {#if !value2.length}
        เลือก
      {:else}
        {#each value2 as temp}
          {themes.find((item) => item.value === temp)?.label + ', ' ||
            temp + ', '}
        {/each}
      {/if}
    </Select.Trigger>
    <Select.Content role="listbox">
      <Select.Group>
        {#each themes as fruit}
          <Select.Item
            value={fruit.value}
            label={fruit.label}
            aria-label={fruit.label}
            role="option"
            check={true}
          >
            {fruit.label}
          </Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>
</Story>

<Story name="Multiple Select with Chips">
  <Select.Root type="multiple" name="favoriteFruit" bind:value={value2}>
    <div class="relative w-[300px]">
      {#if value2.length}
        <div
          class="absolute flex max-w-[274px] w-auto pl-2 top-1/2 -translate-y-1/2 items-center gap-1 truncate"
        >
          {#each value2 as temp}
            <Chip
              class="z-10"
              closable
              onClose={(event: MouseEvent) => {
                event.stopPropagation()
                value2 = value2.filter((item) => item != temp)
              }}
              aria-label={`Remove ${themes.find((item) => item.value === temp)?.label || temp}`}
            >
              {themes.find((item) => item.value === temp)?.label || temp}
            </Chip>
          {/each}
        </div>
      {/if}
      <Select.Trigger
        aria-label="Select multiple fruits"
        class="w-[300px] h-12 z-0 "
        placeholder="Select fruits"
      >
        {#if !value2.length}
          เลือก
        {/if}
      </Select.Trigger>
    </div>
    <Select.Content role="listbox">
      <Select.Group>
        {#each themes as fruit}
          <Select.Item
            value={fruit.value}
            label={fruit.label}
            aria-label={fruit.label}
            role="option"
            check={true}
          >
            {fruit.label}
          </Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>
</Story>
