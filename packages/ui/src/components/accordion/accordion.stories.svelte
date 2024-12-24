<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import * as Accordion from './index.js'

  const { Story } = defineMeta({
    title: 'Atom/Accordion',

    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component: `
The **Accordion** component is used to organize content into expandable and collapsible sections. It is ideal for displaying structured data in a concise and interactive way.

This example demonstrates the use of each sub-component:
- **Accordion.Root**: The root container for the Accordion, which manages the overall state and behavior of the component.
- **Accordion.Item**: Represents an individual section within the Accordion. Each item can be expanded or collapsed independently.
- **Accordion.Trigger**: The clickable element that toggles the visibility of the corresponding content.
- **Accordion.Content**: The content displayed when the associated Accordion.Item is expanded.

You can use this component to improve content accessibility and maintain a clean UI design.
          `,
        },
      },
    },
    argTypes: {},
  })
</script>

<!-- 👇 Example story using the Accordion component -->
<Story name="Normal Accordion">
  <Accordion.Root class="w-full sm:max-w-[70%]">
    <Accordion.Item value="item-1">
      <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
      <Accordion.Content>
        Yes. It adheres to the WAI-ARIA design pattern, ensuring accessibility
        for users with assistive technologies.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
      <Accordion.Trigger>Is it styled?</Accordion.Trigger>
      <Accordion.Content>
        Yes. It comes with default styles that align with the aesthetic of other
        components, but you can customize it as needed.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-3">
      <Accordion.Trigger>Is it animated?</Accordion.Trigger>
      <Accordion.Content>
        Yes. The component includes smooth animations by default. However, you
        can disable animations if you prefer a simpler interaction.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</Story>

<Story name="Root Example">
  <Accordion.Root class="bg-gray-50 border border-gray-200 rounded-lg p-6">
    <Accordion.Item value="item-1">
      <Accordion.Trigger>What is the purpose of Root?</Accordion.Trigger>
      <Accordion.Content>
        The Root component serves as the container for all Accordion items. It
        manages the state and controls the behavior of the entire Accordion.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</Story>

<Story name="Item Example">
  <Accordion.Root>
    <Accordion.Item value="item-1">
      <Accordion.Trigger>What is an Item?</Accordion.Trigger>
      <Accordion.Content>
        The Item component represents an individual section in the Accordion.
        Each Item has its own value and can be expanded or collapsed
        independently.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
      <Accordion.Trigger>Can multiple Items exist?</Accordion.Trigger>
      <Accordion.Content>
        Yes, multiple Items can exist within a single Accordion. Each Item is
        treated as an independent section.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</Story>

<Story name="Trigger Example">
  <Accordion.Root>
    <Accordion.Item value="item-1">
      <Accordion.Trigger>What is a Trigger?</Accordion.Trigger>
      <Accordion.Content>
        The Trigger component is the interactive element that toggles the
        visibility of its associated Content.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</Story>

<Story name="Content Example">
  <Accordion.Root>
    <Accordion.Item value="item-1">
      <Accordion.Trigger>What is Content?</Accordion.Trigger>
      <Accordion.Content>
        The Content component holds the information or elements that are
        revealed when the Item is expanded.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</Story>
