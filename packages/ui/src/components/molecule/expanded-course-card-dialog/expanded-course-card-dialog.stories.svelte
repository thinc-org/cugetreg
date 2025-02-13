<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import ExpandedCourseCardDialog from './expanded-course-card-dialog.svelte'

  const { Story } = defineMeta<typeof ExpandedCourseCardDialog>({
    title: 'Molecule/Expanded Course Card Dialog',
    component: ExpandedCourseCardDialog,
    tags: ['autodocs'],
    argTypes: {
      haveSection: {
        control: 'array',
        description: 'list of section',
      },
      course: {
        control: 'object',
        description: 'course object',
      },
    },
  })
</script>

<Story
  name="Default"
  args={{
    haveSection: [
      { value: '1', label: 'เซค 1' },
      { value: '2', label: 'เซค 2' },
      { value: '3', label: 'เซค 3' },
    ],
    course: {
      code: '0123101',
      name: 'PARAGRAPH WRITING',
      credits: 3,
      reviews: 14,
      sections: [
        {
          section: 1,
          seats: { status: 'full', count: '28/28' },
          instructors: ['SSS'],
          group: '4EE ONLY',
          schedule: [
            {
              day: 'MON',
              time: '16:00 - 17:00',
              room: 'MAHIT 202',
              type: 'LECT',
            },
            {
              day: 'THU',
              time: '16:00 - 17:00',
              room: 'MAHIT 202',
              type: 'LECT',
            },
          ],
          selectable: true,
        },
        {
          section: 2,
          seats: { status: 'avaliable', count: '20/28' },
          instructors: ['SSS'],
          group: '4EE ONLY',
          schedule: [
            {
              day: 'MON',
              time: '16:00 - 17:00',
              room: 'MAHIT 202',
              type: 'LECT',
            },
            {
              day: 'THU',
              time: '16:00 - 17:00',
              room: 'MAHIT 202',
              type: 'LECT',
            },
          ],
          selectable: true,
        },
      ],
    },
  }}
/>
