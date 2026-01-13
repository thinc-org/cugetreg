<script context="module" lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import CreateTimetable from './create-timetable.svelte'

  const { Story } = defineMeta({
    title: 'Organism/Create Timetable',
    component: CreateTimetable,
    tags: ['autodocs'],
  })
</script>

<script lang="ts">
  const defaultHandleCancel = () => {
    console.log('Cancel clicked')
  }

  const defaultHandleConfirm = () => {
    console.log('Confirm clicked')
  }

  const customHandleCancel = () => {
    alert('Custom cancel action!')
  }

  const customHandleConfirm = () => {
    alert('Custom confirm action!')
  }
</script>

<Story
  name="Default"
  args={{
    handleCancel: defaultHandleCancel,
    handleConfirm: defaultHandleConfirm,
    shareLink: 'https://example.com/my-timetable',
  }}
/>

<Story
  name="Custom Share Link"
  args={{
    handleCancel: defaultHandleCancel,
    handleConfirm: defaultHandleConfirm,
    shareLink: 'https://cugetreg.com/shared/timetable-123',
  }}
/>

<Story
  name="With Custom Handlers"
  args={{
    handleCancel: customHandleCancel,
    handleConfirm: customHandleConfirm,
    shareLink: 'https://example.com/my-timetable',
  }}
/>
