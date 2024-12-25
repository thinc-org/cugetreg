<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { CourseCard } from './index.js'

  const { Story } = defineMeta<typeof CourseCard>({
    title: 'Molecule/CourseCard',
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
      },
    },
  })
</script>

<!--👇 Each story then reuses that template-->

<Story name="Default" />

<Story name="Recommended" args={{ recommended: true }} />
