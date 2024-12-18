<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { CourseCard } from './index.js'

  export const meta = {
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
  } satisfies Meta<CourseCard>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<!--👇 We create a “template” of how args map to rendering-->
<Template let:args>
  <CourseCard {...args} />
</Template>

<!--👇 Each story then reuses that template-->
<Story name="Default" />

<Story name="Recommended" args="{{ recommended: true }}" />
