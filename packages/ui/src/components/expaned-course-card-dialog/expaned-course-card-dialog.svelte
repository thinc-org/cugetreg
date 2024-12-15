<script lang="ts">
  import { ArrowRight, Check, Dot, Plus } from 'lucide-svelte'

  import { Button } from '../button/index'
  import { SeatChip } from '../seat-chip/index'
  import * as Table from '../Table/index'
</script>

<div class="w-fit h-fit border-red-500 border p-6 space-y-4">
  <div class="flex justify-between">
    <div class="flex gap-8">
      <div class="space-y-1">
        <p class="text-on-surface text-h2">0123101 PARAGRAP WRITING</p>
        <p
          class="flex text-on-surface-placeholder text-body2 font-normal font-sarabun"
        >
          3 หน่วยกิต <span><Dot class="text-surface-container-lowest" /></span
          >14 รีวิว
        </p>
      </div>
      <Button variant="outlined"
        >ข้อมูลรายวิชา <ArrowRight
          class="text-on-primary-container size-4 ml-1 stroke-[3]"
        /></Button
      >
    </div>
    <div>
      <p class="text-caption text-on-surface-placeholder font-normal">
        แสดงเซคชัน
      </p>
    </div>
  </div>
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>เซคชัน</Table.Head>
        <Table.Head>จำนวนที่รับ</Table.Head>
        <Table.Head>ผู้สอน</Table.Head>
        <Table.Head>กลุ่ม</Table.Head>
        <Table.Head>วันเวลาเรียน</Table.Head>
        <Table.Head>ห้องเรียน</Table.Head>
        <Table.Head>รูปแบบ</Table.Head>
        <Table.Head></Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <!-- First Section -->
      <Table.Row class="border-b-0">
        <Table.Cell data-rowspan="true" rowspan="{2}">1</Table.Cell>
        <Table.Cell data-rowspan="true" rowspan="{2}">
          <SeatChip class="text-body2 px-4 py-0.5" status="full">
            28/28
          </SeatChip>
        </Table.Cell>
        <Table.Cell>SSS</Table.Cell>
        <Table.Cell>4EE ONLY</Table.Cell>
        <Table.Cell>MON 16:00 - 17:00</Table.Cell>
        <Table.Cell>MAHIT 202</Table.Cell>
        <Table.Cell>LECT</Table.Cell>
        <Table.Cell><Button variant="solid">เลือก <Check /></Button></Table.Cell
        >
      </Table.Row>
      <Table.Row>
        <Table.Cell>SSS</Table.Cell>
        <Table.Cell>4EE ONLY</Table.Cell>
        <Table.Cell>THU 16:00 - 17:00</Table.Cell>
        <Table.Cell>MAHIT 202</Table.Cell>
        <Table.Cell>LECT</Table.Cell>
      </Table.Row>
      <!-- Second Section -->
      <Table.Row>
        <Table.Cell data-rowspan="true" rowspan="{2}">2</Table.Cell>
        <Table.Cell data-rowspan="true" rowspan="{2}">
          <SeatChip class="text-body2 px-4 py-0.5" status="avaliable">
            20/28
          </SeatChip>
        </Table.Cell>
        <Table.Cell>SSS</Table.Cell>
        <Table.Cell>4EE ONLY</Table.Cell>
        <Table.Cell>MON 16:00 - 17:00</Table.Cell>
        <Table.Cell>MAHIT 202</Table.Cell>
        <Table.Cell>LECT</Table.Cell>
        <Table.Cell
          ><Button variant="outlined">เลือก <Plus /></Button></Table.Cell
        >
      </Table.Row>
      <Table.Row>
        <Table.Cell>SSS</Table.Cell>
        <Table.Cell>4EE ONLY</Table.Cell>
        <Table.Cell>THU 16:00 - 17:00</Table.Cell>
        <Table.Cell>MAHIT 202</Table.Cell>
        <Table.Cell>LECT</Table.Cell>
      </Table.Row>
      <!-- Third Section -->
      <Table.Row>
        <Table.Cell data-rowspan="true" rowspan="{2}" class="text-neutral-500">
          3
        </Table.Cell>
        <Table.Cell data-rowspan="true" rowspan="{2}">
          <SeatChip class="text-body2 px-4 py-0.5" status="close">
            28/28
          </SeatChip>
        </Table.Cell>
        <Table.Cell class="text-neutral-500">SSS</Table.Cell>
        <Table.Cell class="text-neutral-500">4EE ONLY</Table.Cell>
        <Table.Cell class="text-neutral-500">THU 16:00 - 17:00</Table.Cell>
        <Table.Cell class="text-neutral-500">MAHIT 202</Table.Cell>
        <Table.Cell class="text-neutral-500">LECT</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell class="text-neutral-500">SSS</Table.Cell>
        <Table.Cell class="text-neutral-500">4EE ONLY</Table.Cell>
        <Table.Cell class="text-neutral-500">THU 16:00 - 17:00</Table.Cell>
        <Table.Cell class="text-neutral-500">MAHIT 202</Table.Cell>
        <Table.Cell class="text-neutral-500">LECT</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
</div>
