<script lang="ts">
  import * as Table from '../../atom/table/index.ts'
  import { Button } from '../../atom/button/index.ts'
</script>

<div>
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>เซคชั่น</Table.Head>
        <Table.Head>จำนวนที่รับ</Table.Head>
        <Table.Head>ผู้สอน</Table.Head>
        <Table.Head>วันเวลาที่เรียน</Table.Head>
        <Table.Head>ห้องเรียน</Table.Head>
        <Table.Head>รูปแบบ</Table.Head>
        <Table.Head>&nbsp;</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row class="border-b-0">
        <Table.Cell data-rowspan={true} rowspan={2}>1</Table.Cell>
        <Table.Cell>28/28</Table.Cell>
        <Table.Cell>NNN</Table.Cell>
        <Table.Cell>THU 21:00 - 24:00</Table.Cell>
        <Table.Cell>ENG4 18-16</Table.Cell>
        <Table.Cell>LECT</Table.Cell>
        <Table.Cell><Button>เลือก +</Button></Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>28/28</Table.Cell>
        <Table.Cell>NNN</Table.Cell>
        <Table.Cell>FRI 21:00 - 24:00</Table.Cell>
        <Table.Cell>ENG4 18-16</Table.Cell>
        <Table.Cell>LECT</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
</div>
