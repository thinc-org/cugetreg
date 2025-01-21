<script lang="ts">
  import { Check, Dot, Plus } from 'lucide-svelte'

  import { cn } from '@repo/utils'

  import { Button } from '../../atom/button/index.js'
  import { DayChip } from '../../atom/day-chip/index.js'
  import { GenedChip } from '../../atom/gened-chip/index.js'
  import { RecommendedTag } from '../../atom/recommended-tag/index.js'
  import type { Course } from './index.js'

  interface Props {
    class?: string | undefined | null
    course?: Course
    selected?: boolean
    recommended?: boolean
    [key: string]: unknown
  }

  let {
    class: className = undefined,
    course,
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
    'flex flex-col w-[334px] h-[164px] md:w-[440px] md:h-[194px] px-4 py-5 md:p-6 gap-3 ring-2 ring-neutral-100 rounded-xl relative',
    className,
  )}
  {...rest}
>
  {#if recommended}
    <RecommendedTag class="absolute top-[-9.5px] left-0" />
  {/if}
  <div class="flex flex-row justify-between items-center">
    <div class="flex flex-col">
      <div class="font-medium text-caption">{course?.code}</div>
      <div class="font-medium sm:text-body2 md:text-body1">
        {course?.name}
      </div>
    </div>
    <div class="flex gap-1">
      {#each course?.gened ?? [] as gened}
        <GenedChip type={gened} />
      {/each}
    </div>
  </div>
  <div class="flex flex-col gap-2">
    <div
      class="font-normal text-caption text-neutral-400 flex flex-row items-center"
    >
      <span>{course?.credit} หน่วยกิต</span>
      <Dot color="#EDEDF1" size="16" />
      <span>ที่นั่ง GenEd {course?.seat} / {course?.maxseat}</span>
      <Dot color="#EDEDF1" size="16" />
      <span>{course?.review} รีวิว</span>
    </div>
    <div class="flex gap-2">
      {#each course?.days ?? [] as day}
        <DayChip {day} />
      {/each}
    </div>
  </div>
  <div class="flex flex-row justify-between items-center">
    <Button
      variant="outlined"
      color="neutral"
      class="w-36 h-7 md:w-48 md:h-9 text-caption md:text-body2"
    >
      เลือกเซคชัน
    </Button>
    {#if !selected}
      <Button
        variant="outlined"
        color="primary"
        onclick={onButtonClick}
        class="w-36 h-7 md:w-48 md:h-9 text-caption md:text-body2"
        size="sm"
      >
        เลือก <Plus size="16" strokeWidth="3" />
      </Button>
    {:else}
      <Button
        color="primary"
        onclick={onButtonClick}
        class="w-36 h-7 md:w-48 md:h-9 text-caption md:text-body2"
      >
        เลือก <Check size="16" strokeWidth="3" />
      </Button>
    {/if}
  </div>
</div>
