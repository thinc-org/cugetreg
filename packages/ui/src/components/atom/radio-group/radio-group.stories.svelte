<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import * as RadioGroup from './index.js'

  const { Story } = defineMeta({
    title: 'Atom/Radio Group',
    component: RadioGroup,
    tags: ['autodocs'],
    argTypes: {
      'aria-label': {
        control: 'text',
        description: 'string value that labels an interactive element',
      },
      value: {
        description: 'The selected value in the radio group.',
        control: {
          type: 'select',
        },
        options: ['option-one', 'option-two'],
        defaultValue: 'option-one',
      },
      className: {
        control: false,
      },
      itemValue1: {
        control: 'text',
        description: 'Value for the first RadioGroup.Item',
        defaultValue: 'option-one',
      },
      'item1-label': {
        control: 'text',
        description: 'Label for the first RadioGroup.Item',
        defaultValue: 'option 1',
      },
      itemValue2: {
        control: 'text',
        description: 'Value for the second RadioGroup.Item',
        defaultValue: 'option-two',
      },
      'item2-label': {
        control: 'text',
        description: 'Label for the second RadioGroup.Item',
        defaultValue: 'option 2',
      },
      onClick: {
        action: 'onClick',
      },
    },
  })
</script>

{#snippet template(args)}
  <RadioGroup.Root {...args}>
    <RadioGroup.Item
      value={args.itemValue1}
      id={args.itemValue1}
      label={args['item1-label']}
      aria-label={args['aria-label']}
    />
    <RadioGroup.Item
      value={args.itemValue2}
      id={args.itemValue2}
      label={args['item2-label']}
      aria-label={args['aria-label']}
    />
  </RadioGroup.Root>
{/snippet}

<Story
  name="Default"
  args={{
    value: 'option-one',
    itemValue1: 'option-one',
    'item1-label': 'option 1',
    itemValue2: 'option-two',
    'item2-label': 'option 2',
    'aria-label': 'for example of enable radio group',
  }}
>
  {#snippet children(args)}
    {@render template(args)}
  {/snippet}
</Story>

<Story
  name="Disabled"
  args={{
    itemValue1: 'option-one',
    'item1-label': 'option 1',
    itemValue2: 'option-two',
    'item2-label': 'option 2',
    disabled: true,
    'aria-label': 'for example of disabled radio group',
  }}
>
  {#snippet children(args)}
    {@render template(args)}
  {/snippet}
</Story>
