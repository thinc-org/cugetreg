<script context="module" lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { SelectorButton } from './index.js'

  const { Story } = defineMeta({
    title: 'Atom/Selector Button',
    component: SelectorButton,
    tags: ['autodocs'],
    parameters: {
      layout: 'centered',
    },
  })
</script>

<script lang="ts">
  const mockSection = {
    section: '001',
    seats: '10/30',
    teacher: 'อ.สมชาย',
    schedule: 'จ. 09:00–12:00',
    room: 'SCB-101',
    type: 'Lecture',
  }

  const handleCustomClick = () => {
    alert('Custom click handler triggered!')
  }
</script>

<!-- Default behavior (internal state) -->
<Story name="Default">
  <SelectorButton selected={mockSection} />
</Story>

<!-- With custom click handler -->
<Story name="With Custom Click">
  <SelectorButton selected={mockSection} handleClick={handleCustomClick} />
</Story>
