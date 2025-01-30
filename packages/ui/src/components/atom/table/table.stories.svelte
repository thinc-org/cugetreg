<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import * as Table from './index.js'

  const { Story } = defineMeta({
    title: 'Atom/Table',

    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component: `
The **Table** component is used to render structured data in a tabular format.
This example demonstrates the use of each sub-component:
- **Table.Root**: The root container for the table.
- **Table.Header**: The section for the table header, containing column labels.
- **Table.Row**: Represents a row within either the header or the body.
- **Table.Head**: Column headers, typically styled differently from body cells.
- **Table.Body**: Contains the main content rows.
- **Table.Cell**: Represents an individual data cell, with support for styling and spans. 
**(don't forget to use data-rowspan='true' or 'false' to apply correct style)**
          `,
        },
      },
    },
    argTypes: {},
  })
</script>

<!-- 👇 Each story then reuses that template -->

<Story name="Normal Table">
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>Invoice</Table.Head>
        <Table.Head>Status</Table.Head>
        <Table.Head>Method</Table.Head>
        <Table.Head>Amount</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row class="border-b-0">
        <Table.Cell data-rowspan={true} rowspan={2}>INV001</Table.Cell>
        <Table.Cell>Paid</Table.Cell>
        <Table.Cell>Credit Card</Table.Cell>
        <Table.Cell>$250.00</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Unpaid</Table.Cell>
        <Table.Cell>QR Code Promptpay</Table.Cell>
        <Table.Cell>$1,250.00</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>INV002</Table.Cell>
        <Table.Cell>Paid</Table.Cell>
        <Table.Cell>Mobile Banking</Table.Cell>
        <Table.Cell>$550.00</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
</Story>

<Story name="Header">
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>Invoice</Table.Head>
        <Table.Head>Status</Table.Head>
        <Table.Head>Method</Table.Head>
        <Table.Head>Amount</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell></Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
</Story>

<Story name="Body">
  <Table.Root>
    <Table.Body>
      <Table.Row>
        <Table.Cell>INV001</Table.Cell>
        <Table.Cell>Paid</Table.Cell>
        <Table.Cell>Credit Card</Table.Cell>
        <Table.Cell>$250.00</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>INV002</Table.Cell>
        <Table.Cell>Unpaid</Table.Cell>
        <Table.Cell>QR Code Promptpay</Table.Cell>
        <Table.Cell>$1,250.00</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>INV003</Table.Cell>
        <Table.Cell>Paid</Table.Cell>
        <Table.Cell>Mobile Banking</Table.Cell>
        <Table.Cell>$550.00</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
</Story>
