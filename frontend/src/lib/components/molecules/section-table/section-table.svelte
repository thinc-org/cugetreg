<script lang="ts">
  import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from '../../atoms/table'
  import { Chip } from '../../atoms/chip'
  import { SelectorButton } from '../../atoms/selector-button'

  interface Props {
    tableData: Array<{
      section: string
      seats: string
      teacher: string
      schedule: string
      room: string
      type: string
    }>
  }

  let { tableData }: Props = $props()

  const getSeatColor = (value: string) => {
    if (value === 'ปิด') return 'bg-[#EDEDF1] text-[#6F7593]'
    if (value.includes('/')) {
      const [taken, total] = value.split('/').map((n) => parseInt(n.trim()))
      if (taken < total) return 'bg-[#D1FEB6] text-[#4B991C]'
      return 'bg-[#FDDBDB] text-[#B10C0C]'
    }
    return 'bg-[#EDEDF1] text-[#6F7593]'
  }
</script>

<Table
  class="w-234 border-separate overflow-hidden rounded-xl border border-[#D6D7E1]"
>
  <TableHeader class="bg-[#F6F6F9] ">
    <TableRow
      class="h-8 divide-x divide-white text-center text-sm font-medium tracking-[0.15px] text-[#4A70C6]"
    >
      <TableHead class="w-22">เซคชั่น</TableHead>
      <TableHead class="w-36">จำนวนที่รับ</TableHead>
      <TableHead class="w-27">ผู้สอน</TableHead>
      <TableHead class="w-56">วันเวลาเรียน</TableHead>
      <TableHead class="w-36">ห้องเรียน</TableHead>
      <TableHead class="w-24">รูปแบบ</TableHead>
      <TableHead class="w-31.75"></TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {#each tableData as row}
      <TableRow
        class="h-8 divide-x divide-white text-center  align-middle text-sm font-medium tracking-[0.15px]"
      >
        <TableCell
          class={`${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
        >
          {row.section}
        </TableCell>

        <TableCell>
          <Chip closable={false} class={getSeatColor(row.seats)}>
            {row.seats}
          </Chip>
        </TableCell>

        <TableCell
          class={`${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
        >
          {row.teacher}
        </TableCell>

        <TableCell
          class={`${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
        >
          {row.schedule}
        </TableCell>

        <TableCell
          class={`${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
        >
          {row.room}
        </TableCell>

        <TableCell
          class={`${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
        >
          {row.type}
        </TableCell>

        <TableCell><SelectorButton selected={row} /></TableCell>
      </TableRow>
    {/each}
  </TableBody>
</Table>
