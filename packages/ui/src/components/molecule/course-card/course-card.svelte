<script lang="ts">
  import { Check, Dot, Plus } from 'lucide-svelte'

  import { cn } from '../../../utils.js'
  import { Button } from '../../atom/button/index.js'
  import { DayChip } from '../../atom/day-chip/index.js'
  import { GenedChip } from '../../atom/gened-chip/index.js'
  import { RecommendedTag } from '../../atom/recommended-tag/index.js'

  interface Props {
    class?: string | undefined | null
    course?: {
      code: string
      name: string
      credit: number
      gened: ('HU' | 'SC' | 'SO' | 'IN')[]
      seat: number
      maxseat: number
      review: number
      days: ('MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU')[]
    }
    selected?: boolean
    recommended?: boolean
    [key: string]: unknown
  }

  let {
    class: className = undefined,
    course = {
      code: '0123101',
      name: 'PARAGRAPH WRITING',
      credit: 3,
      gened: ['HU'],
      seat: 24,
      maxseat: 305,
      review: 14,
      days: ['MO', 'TU', 'WE'],
    },
    selected = $bindable(false),
    recommended = false,
    ...rest
  }: Props = $props()

  export const onButtonClick = () => {
    selected = !selected
  }
</script>

<div
  class={cn(
    'flex flex-col w-[334px] h-[170px] lg:w-[440px] lg:h-[200px] ring-2 ring-neutral-100 rounded-xl py-5 px-4 lg:p-6 justify-between relative',
    className,
  )}
  {...rest}
>
  {#if recommended}
    <RecommendedTag class="absolute top-[-9.5px] left-0" />
  {/if}
  <div class="flex flex-row justify-between items-center">
    <div class="flex flex-col">
      <div class="font-medium text-caption">{course.code}</div>
      <div class="font-medium text-subtitle">{course.name}</div>
    </div>
    <div class="flex gap-1">
      {#each course.gened as gened}
        <GenedChip type={gened} />
      {/each}
    </div>
  </div>
  <div class="flex flex-col gap-2">
    <div
      class="font-normal text-caption text-neutral-400 flex flex-row items-center"
    >
      {course.credit} หน่วยกิต <Dot color="#EDEDF1" /> ที่นั่ง GenEd {course.seat}
      /
      {course.maxseat}
      <Dot color="#EDEDF1" />
      {course.review} รีวิว
    </div>
    <div class="flex gap-2">
      {#each course.days as day}
        <DayChip {day} />
      {/each}
    </div>
  </div>
  <div class="flex flex-row justify-between items-center">
    <Button variant="outlined" size="lg" color="neutral" class="w-36 lg:w-48"
      >เลือกเซคชัน</Button
    >
    {#if !selected}
      <Button
        variant="outlined"
        color="primary"
        onclick={onButtonClick}
        class="w-36 lg:w-48"
      >
        เลือก <Plus size="16" strokeWidth="3" />
      </Button>
    {:else}
      <Button color="primary" onclick={onButtonClick} class="w-36 lg:w-48">
        เลือก <Check size="16" strokeWidth="3" />
      </Button>
    {/if}
  </div>
</div>
