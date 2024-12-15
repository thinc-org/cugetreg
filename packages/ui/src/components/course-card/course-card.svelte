<script lang="ts">
  import { Plus, Check } from 'lucide-svelte'

  import { GenedChip } from '../gened-chip'
  import { DayChip } from '../day-chip'
  import { Button } from '../button'
  import { RecommendedTag } from '../recommended-tag'

  import { cn } from '../../utils'

  let className: string | undefined | null = undefined
  export { className as class }

  export let course: {
    code: string
    name: string
    credit: number
    gened: String[]
    seat: number
    maxseat: number
    review: number
    days: String[]
  } = {
    code: 'testCode',
    name: 'testName',
    credit: 0,
    gened: ['HU', 'SC', 'SO'],
    seat: 0,
    maxseat: 0,
    review: 0,
    days: ['MO', 'TU', 'WE'],
  }

  export let Selected: boolean = false
  export let recommended: boolean = false

  export const onButtonClick = () => {
    Selected = !Selected
  }
</script>

<div
  class="{cn(
    'flex flex-col w-[440px] h-48 ring-2 ring-neutral-100 rounded-xl p-6 justify-between relative',
    className,
  )}"
  {...$$restProps}
>
  {#if recommended}
    <RecommendedTag class="absolute top-[-9.5px] left-0" />
  {/if}
  <div class="flex flex-row justify-between items-center">
    <div class="flex flex-col">
      <div class="font-medium text-caption">{course.code}</div>
      <div class="font-medium text-body1">{course.name}</div>
    </div>
    <div class="flex gap-1">
      {#each course.gened as gened}
        <GenedChip type="{gened}" />
      {/each}
    </div>
  </div>
  <div class="flex flex-col gap-2">
    <div class="font-normal text-caption text-neutral-400">
      {course.credit} หน่วยกิต - ที่นั่ง GenEd {course.seat} / {course.maxseat}
      -
      {course.review} รีวิว
    </div>
    <div class="flex gap-2">
      {#each course.days as day}
        <DayChip {day} />
      {/each}
    </div>
    <div class="flex flex-row justify-between items-center">
      <Button variant="outlined" size="lg" color="neutral" class="w-48"
        >เลือกเซคชัน</Button
      >
      {#if !Selected}
        <Button
          variant="outlined"
          size="lg"
          color="primary"
          on:click="{onButtonClick}"
          class="w-48"
        >
          เลือก <Plus size="16" strokeWidth="3" />
        </Button>
      {:else}
        <Button
          size="lg"
          color="primary"
          on:click="{onButtonClick}"
          class="w-48"
        >
          เลือก <Check size="16" strokeWidth="3" />
        </Button>
      {/if}
    </div>
  </div>
</div>
