<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { Checkbox } from './index.js'

  const { Story } = defineMeta<typeof Checkbox>({
    title: 'Atom/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    argTypes: {
      checked: {
        control: 'boolean',
        defaultValue: false,
      },
      label: {
        control: 'text',
        defaultValue: '',
      },
      onClick: {
        action: 'onClick',
      },
      'aria-label': {
        control: 'text',
        description:
          'attribute defines a string value that labels an interactive element',
      },
    },
  })
</script>

<!-- 👇 Each story then reuses that template -->

<Story
  name="Unchecked"
  args={{
    checked: false,
    label: 'Accept Terms',
    'aria-label': 'for accept terms',
  }}
/>

<Story
  name="Checked"
  args={{
    checked: true,
    label: 'Accept Terms',
    'aria-label': 'for accept terms',
  }}
/>

<Story
  name="Unchecked Without Label"
  args={{
    checked: false,
    'aria-label': 'for example of unchecked checkbox without label',
  }}
/>

<Story
  name="Checked Without Label"
  args={{
    checked: true,
    'aria-label': 'for example of checkbox without label',
  }}
/>

<Story
  name="Disabled Checkbox"
  args={{ checked: false, label: 'Disabled Checkbox', disabled: true }}
/>
