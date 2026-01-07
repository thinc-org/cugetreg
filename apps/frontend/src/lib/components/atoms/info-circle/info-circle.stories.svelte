<script context="module" lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import InfoCircle from './info-circle.svelte'

  const { Story } = defineMeta({
    title: 'Atom/Info Circle',
    component: InfoCircle,
    tags: ['autodocs'],
    parameters: {
      layout: 'centered',
    },
  })
</script>

<Story
  name="Default"
  args={{
    tooltipText: 'This is helpful information for the user.',
  }}
/>

<Story
  name="Short Text"
  args={{
    tooltipText: 'Quick tip',
  }}
/>

<Story
  name="Long Text"
  args={{
    tooltipText:
      'This is a longer tooltip with more detailed information that explains something complex. It will wrap within the max-width constraint.',
  }}
/>

<Story
  name="Very Long Text"
  args={{
    tooltipText:
      'This is an even longer tooltip that contains multiple sentences of information. It demonstrates how the tooltip handles extensive content while maintaining readability. The max-width of 320px (max-w-80) ensures the text wraps appropriately without becoming too wide.',
  }}
/>

<Story name="Empty Tooltip" args={{ tooltipText: '' }} />
