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

  export let tableData = [
    {
      section: '1',
      seats: '28 / 28',
      teacher: 'SSS',
      schedule: 'THU 16:00 - 17:00',
      room: 'MAHIT 202',
      type: 'LECT',
    },
    {
      section: '2',
      seats: '12 / 28',
      teacher: 'SSS',
      schedule: 'THU 16:00 - 17:00',
      room: 'MAHIT 202',
      type: 'LECT',
    },
    {
      section: '3',
      seats: 'ปิด',
      teacher: 'SSS',
      schedule: 'THU 16:00 - 17:00',
      room: 'MAHIT 202',
      type: 'LECT',
    },
  ]

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

<Table class="w-234 border-collapse">
  <TableHeader class="bg-[#F6F6F9]">
    <TableRow
      class="h-8 text-center align-middle text-sm font-medium tracking-[0.15px] text-[#4A70C6]"
    >
      <TableHead class="w-22 border-r border-white">เซคชั่น</TableHead>
      <TableHead class="w-36 border-r border-white">จำนวนที่รับ</TableHead>
      <TableHead class="w-27 border-r border-white">ผู้สอน</TableHead>
      <TableHead class="w-56 border-r border-white">วันเวลาเรียน</TableHead>
      <TableHead class="w-36 border-r border-white">ห้องเรียน</TableHead>
      <TableHead class="w-24 border-r border-white">รูปแบบ</TableHead>
      <TableHead class="w-31.75"></TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {#each tableData as row}
      <TableRow
        class="h-8 text-center align-middle text-sm font-medium tracking-[0.15px]"
      >
        <TableCell
          class={`border-r border-white ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
        >
          {row.section}
        </TableCell>

        <TableCell class={`border-r border-white`}>
          <Chip closable={false} class={getSeatColor(row.seats)}>
            {row.seats}
          </Chip>
        </TableCell>

        <TableCell
          class={`border-r border-white ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
        >
          {row.teacher}
        </TableCell>

        <TableCell
          class={`border-r border-white ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
        >
          {row.schedule}
        </TableCell>

        <TableCell
          class={`border-r border-white ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
        >
          {row.room}
        </TableCell>

        <TableCell
          class={`border-r border-white ${row.seats === 'ปิด' ? 'text-[#6F7593]' : 'text-black'}`}
        >
          {row.type}
        </TableCell>

        <TableCell><SelectorButton selected={row} /></TableCell>
      </TableRow>
    {/each}
  </TableBody>
</Table>
