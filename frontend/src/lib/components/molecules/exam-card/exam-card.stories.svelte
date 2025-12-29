<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import ExamCard from './exam-card.svelte'
  import type { Exam } from './types'

  const { Story } = defineMeta({
    title: 'Molecule/ExamCard',
    component: ExamCard,
    tags: ['autodocs'],
    argTypes: {
      date: {
        control: 'text',
      },
      data: {
        control: false,
      },
    },
  })
</script>

<script lang="ts">
  const exams: Exam[] = [
    {
      id: 'exam-1',
      colour: 'pink',
      time: '8:30-11:30 น.',
      subject: 'ICE Capstone',
    },
    {
      id: 'exam-2',
      colour: 'green',
      time: '13:00-16:00 น.',
      subject: 'Principles of Data Communication',
    },
    {
      id: 'exam-3',
      colour: 'indigo',
      time: '13:00-16:00 น.',
      subject: 'Database Systems',
    },
    {
      id: 'exam-4',
      colour: 'error',
      time: '13:00-16:00 น.',
      subject: 'Software Engineering',
    },
  ]
</script>

<!-- Default -->
<Story
  name="Default"
  args={{
    date: 'จันทร์ 3 ธ.ค. 2567',
    data: exams,
  }}
/>

<!-- Single exam -->
<Story
  name="Single exam"
  args={{
    date: 'จันทร์ 3 ธ.ค. 2567',
    data: [exams[0]],
  }}
/>

<!-- Error state -->
<Story
  name="Error"
  args={{
    date: 'จันทร์ 3 ธ.ค. 2567',
    data: [exams[3]],
  }}
/>

<!-- Empty -->
<Story
  name="Empty"
  args={{
    date: 'จันทร์ 3 ธ.ค. 2567',
    data: [],
  }}
/>
