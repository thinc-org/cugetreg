<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import * as RadioGroup from './index.js'

  export const meta = {
    title: 'Atom/RadioGroup',
    component: RadioGroup,
    tags: ['autodocs'],
    argTypes: {
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
  } satisfies Meta<RadioGroup>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<Template let:args>
  <RadioGroup.Root {...args}>
    <RadioGroup.Item
      value="{args.itemValue1}"
      id="{args.itemValue1}"
      label="{args['item1-label']}"
    />
    <RadioGroup.Item
      value="{args.itemValue2}"
      id="{args.itemValue2}"
      label="{args['item2-label']}"
    />
  </RadioGroup.Root>
</Template>

<Story
  name="Default"
  args="{{
    value: 'option-one',
    itemValue1: 'option-one',
    'item1-label': 'option 1',
    itemValue2: 'option-two',
    'item2-label': 'option 2',
  }}"
/>

<Story
  name="Disabled"
  args="{{
    itemValue1: 'option-one',
    'item1-label': 'option 1',
    itemValue2: 'option-two',
    'item2-label': 'option 2',
    disabled: true,
  }}"
/>
