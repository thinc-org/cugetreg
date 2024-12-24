<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { Button } from './index.js'

  const { Story } = defineMeta<typeof Button>({
    title: 'Atom/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: {
          type: 'select',
        },
        options: ['solid', 'outline'],
        defaultValue: 'solid',
      },
      size: {
        control: {
          type: 'select',
        },
        options: ['sm', 'default', 'lg'],
        defaultValue: 'default',
      },
      color: {
        control: {
          type: 'select',
        },
        options: ['primary', 'neutral', 'error', 'secondary'],
        defaultValue: 'primary',
      },
      builders: {
        control: false,
      },
      class: {
        control: false,
      },
    },
  })
</script>

<!-- 👇 Each story then reuses that template -->

<Story
  name="Primary Solid"
  args={{ variant: 'solid', size: 'default', color: 'primary' }}
>
  {#snippet children(args)}
    <Button {...args}>Button</Button>
  {/snippet}
</Story>

<Story
  name="Primary Outline"
  args={{ variant: 'outlined', size: 'default', color: 'primary' }}
>
  {#snippet children(args)}
    <Button {...args}>Button</Button>
  {/snippet}
</Story>

<Story
  name="Neutral Solid"
  args={{ variant: 'solid', size: 'default', color: 'neutral' }}
>
  {#snippet children(args)}
    <Button {...args}>Button</Button>
  {/snippet}
</Story>

<Story
  name="Neutral Outline"
  args={{ variant: 'outlined', size: 'default', color: 'neutral' }}
>
  {#snippet children(args)}
    <Button {...args}>Button</Button>
  {/snippet}
</Story>

<Story
  name="Error Solid"
  args={{ variant: 'solid', size: 'default', color: 'error' }}
>
  {#snippet children(args)}
    <Button {...args}>Button</Button>
  {/snippet}
</Story>

<Story
  name="Error Outline"
  args={{ variant: 'outlined', size: 'default', color: 'error' }}
>
  {#snippet children(args)}
    <Button {...args}>Button</Button>
  {/snippet}
</Story>

<Story
  name="Secondary Solid"
  args={{ variant: 'solid', size: 'default', color: 'secondary' }}
>
  {#snippet children(args)}
    <Button {...args}>Button</Button>
  {/snippet}
</Story>

<Story
  name="Secondary Outline"
  args={{ variant: 'outlined', size: 'default', color: 'secondary' }}
>
  {#snippet children(args)}
    <Button {...args}>Button</Button>
  {/snippet}
</Story>
