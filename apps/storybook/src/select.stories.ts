import type { Meta, StoryObj } from '@storybook/svelte'

import Select from './select.svelte'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Example/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['default', 'error', 'success', 'disable'],
    },
    label: {
      control: 'text',
    },
    desc: {
      control: 'text',
    },
  },
} satisfies Meta<Select>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    placeholder: 'select default',
    state: 'default',
  },
}

export const Error: Story = {
  args: {
    placeholder: 'select error',
    state: 'error',
  },
}
export const Success: Story = {
  args: {
    placeholder: 'select success',
    state: 'success',
  },
}
export const Disable: Story = {
  args: {
    placeholder: 'select disable',
    state: 'disable',
  },
}
