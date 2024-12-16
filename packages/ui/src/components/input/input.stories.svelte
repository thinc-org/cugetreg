<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { Input } from './index.js'

  export const meta = {
    title: 'Atom/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
      state: {
        control: {
          type: 'select',
        },
        options: ['default', 'error', 'success'],
        defaultValue: 'default',
      },
    },
  } satisfies Meta<Input>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<!--👇 We create a “template” of how args map to rendering -->

<Template let:args>
  <Input {...args} />
</Template>

<!-- 👇 Each story then reuses that template -->

<Story name="Default" args="{{ state: 'default', placeholder: 'รหัสผ่าน' }}" />
