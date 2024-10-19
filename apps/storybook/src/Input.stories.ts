import type { Meta, StoryObj } from '@storybook/svelte'

import Input from './Input.svelte'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Example/Input',
  component: Input,
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
} satisfies Meta<Input>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    placeholder: 'Input Default',
    state: 'default',
  },
}

export const Error: Story = {
  args: {
    placeholder: 'Input error',
    state: 'error',
  },
}
export const Success: Story = {
  args: {
    placeholder: 'Input success',
    state: 'success',
  },
}
export const Disable: Story = {
  args: {
    placeholder: 'Input disable',
    state: 'disable',
  },
}
