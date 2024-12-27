<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { CourseCard } from './index.js'

  const { Story } = defineMeta<typeof CourseCard>({
    title: 'Molecule/Course Card',
    component: CourseCard,
    tags: ['autodocs'],
    argTypes: {
      selected: {
        control: 'boolean',
      },
      recommended: {
        control: 'boolean',
      },
      onButtonClick: {
        action: 'onButtonClick',
      },
      class: {
        control: false,
      },
      course: {
        control: false,
        defaultValue: {
          code: '0123101',
          name: 'PARAGRAPH WRITING',
          credit: 3,
          gened: ['HU'],
          seat: 24,
          maxseat: 305,
          review: 14,
          days: ['MO', 'TU', 'WE'],
        },
      },
    },
  })
</script>

<!--👇 Each story then reuses that template-->

<Story
  name="Default"
  args={{
    course: {
      code: '0123101',
      name: 'PARAGRAPH WRITING',
      credit: 3,
      gened: ['HU'],
      seat: 24,
      maxseat: 305,
      review: 14,
      days: ['MO', 'TU', 'WE'],
    },
  }}
/>

<Story
  name="Recommended"
  args={{
    course: {
      code: '0123101',
      name: 'PARAGRAPH WRITING',
      credit: 3,
      gened: ['HU'],
      seat: 24,
      maxseat: 305,
      review: 14,
      days: ['MO', 'TU', 'WE'],
    },
    recommended: true,
  }}
/>
