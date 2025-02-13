<script lang="ts">
  import { ArrowRight, Check, Dot, Plus } from 'lucide-svelte'

  import { Button } from '../../atom/button/index'
  import { Chip } from '../../atom/chip/index'
  import { SeatChip } from '../../atom/seat-chip/index'
  import * as Table from '../../atom/table/index'
  import * as Select from '../select/index'
  import { type Course } from './index'
  let {
    course = {
      code: '0123101',
      name: 'PARAGRAPH WRITING',
      credits: 3,
      reviews: 14,
      sections: [
        {
          section: 1,
          seats: { status: 'full', count: '28/28' },
          instructors: ['SSS'],
          group: '4EE ONLY',
          schedule: [
            {
              day: 'MON',
              time: '16:00 - 17:00',
              room: 'MAHIT 202',
              type: 'LECT',
            },
            {
              day: 'THU',
              time: '16:00 - 17:00',
              room: 'MAHIT 202',
              type: 'LECT',
            },
          ],
          selectable: true,
        },
        {
          section: 2,
          seats: { status: 'avaliable', count: '20/28' },
          instructors: ['SSS'],
          group: '4EE ONLY',
          schedule: [
            {
              day: 'MON',
              time: '16:00 - 17:00',
              room: 'MAHIT 202',
              type: 'LECT',
            },
            {
              day: 'THU',
              time: '16:00 - 17:00',
              room: 'MAHIT 202',
              type: 'LECT',
            },
          ],
          selectable: true,
        },
        {
          section: 3,
          seats: { status: 'close', count: '28/28' },
          instructors: ['SSS'],
          group: '4EE ONLY',
          schedule: [
            {
              day: 'THU',
              time: '16:00 - 17:00',
              room: 'MAHIT 202',
              type: 'LECT',
            },
            {
              day: 'THU',
              time: '16:00 - 17:00',
              room: 'MAHIT 202',
              type: 'LECT',
            },
          ],
        },
      ],
    },
    haveSection = [
      { value: '1', label: 'เซค 1' },
      { value: '2', label: 'เซค 2' },
      { value: '3', label: 'เซค 3' },
    ],
  }: { course: Course; haveSection: { value: string; label: string }[] } =
    $props()

  let value2 = $state<string[]>([])
</script>

<div class="w-fit h-fit rounded-xl p-6 space-y-4">
  <div class="flex justify-between">
    <div class="flex gap-8">
      <div class="space-y-1">
        <p class="text-on-surface text-h2">{course.code} {course.name}</p>
        <p
          class="flex text-on-surface-placeholder text-body2 font-normal font-sarabun"
        >
          {course.credits} หน่วยกิต
          <span><Dot class="text-surface-container-lowest" /></span>
          {course.reviews} รีวิว
        </p>
      </div>
      <Button variant="outlined">
        ข้อมูลรายวิชา <ArrowRight
          class="text-on-primary-container size-4 ml-1 stroke-[3]"
        />
      </Button>
    </div>
    <div class="flex-col items-end">
      <p class=" text-caption text-on-surface-placeholder font-normal mb-1">
        แสดงเซคชัน
      </p>
      <Select.Root type="multiple" name="favoriteFruit" bind:value={value2}>
        <div class="relative w-[276px]">
          {#if value2.length}
            <div
              class="absolute flex max-w-[274px] w-auto pl-2 top-1/2 -translate-y-1/2 items-center gap-1 truncate"
            >
              {#each value2 as temp}
                <Chip
                  class="z-10"
                  closable
                  onClose={() => {
                    value2 = value2.filter((item) => item != temp)
                  }}
                  aria-label={`Remove ${haveSection.find((item) => item.value === temp)?.label || temp}`}
                >
                  {haveSection.find((item) => item.value === temp)?.label ||
                    temp}
                </Chip>
              {/each}
            </div>
          {/if}
          <Select.Trigger
            aria-label="Select multiple fruits"
            class="w-[276px] h-9 z-0 "
            placeholder="Select fruits"
          >
            {#if !value2.length}
              เลือก
            {/if}
          </Select.Trigger>
        </div>
        <Select.Content role="listbox">
          <Select.Group>
            {#each haveSection as fruit}
              <Select.Item
                value={fruit.value}
                label={fruit.label}
                aria-label={fruit.label}
                role="option"
                check={true}
              >
                {fruit.label}
              </Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
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
      {#each course.sections as section}
        {#if value2.includes(section.section.toString()) || !value2.length}
          {#each section.schedule as schedule, i}
            <Table.Row class={i === 0 ? 'border-b-0' : ''}>
              {#if i === 0}
                <Table.Cell
                  data-rowspan="true"
                  rowspan={section.schedule.length}
                  >{section.section}</Table.Cell
                >
                <Table.Cell
                  data-rowspan="true"
                  rowspan={section.schedule.length}
                >
                  <SeatChip
                    class="text-body2 px-4 py-0.5"
                    status={section.seats.status}
                  >
                    {section.seats.count}
                  </SeatChip>
                </Table.Cell>
              {/if}
              <Table.Cell>{section.instructors[0]}</Table.Cell>
              <Table.Cell>{section.group}</Table.Cell>
              <Table.Cell>{schedule.day} {schedule.time}</Table.Cell>
              <Table.Cell>{schedule.room}</Table.Cell>
              <Table.Cell>{schedule.type}</Table.Cell>
              {#if i === 0 && section.selectable}
                <Table.Cell>
                  <Button
                    variant={section.seats.status === 'avaliable'
                      ? 'outlined'
                      : 'solid'}
                  >
                    เลือก {#if section.seats.status === 'avaliable'}
                      <Plus />{:else}<Check />
                    {/if}
                  </Button>
                </Table.Cell>
              {/if}
            </Table.Row>
          {/each}
        {/if}
      {/each}
    </Table.Body>
  </Table.Root>
</div>
