<script lang="ts">
  import { getColumnFromDay } from '$lib/mapper';
  import {
    isConflicted,
    parsePeriodTime,
    TIMETABLE_DEFAULT_START,
  } from '$lib/utils/schedule';

  import { TimetableCourseCard } from '@cugetreg/ui/atoms/timetable';
  import type { ColorVariant, Day } from '@cugetreg/utils/types';
  import type { CartItemDetailBase } from '@cugetreg/zod-schemas';

  interface TimetableBlock {
    course: CartItemDetailBase;
    cartItems: CartItemDetailBase[];
    onclick?: (id: string) => void;
    /** First hour shown on the timetable; blocks are offset from it. */
    startTime?: number;
  }

  let {
    course,
    cartItems,
    onclick = () => {},
    startTime: timetableStart = TIMETABLE_DEFAULT_START,
  }: TimetableBlock = $props();
</script>

{#if !course.hidden}
  {@const courseNo = course.courseNo}
  {@const section = course.sections.find(
    (sec) => sec.sectionNo === course.sectionNo,
  )}
  {#each section?.classes ?? [] as period, i (i)}
    {@const startTime = parsePeriodTime(period.periodStart)}
    {@const endTime = parsePeriodTime(period.periodEnd)}
    {@const color = isConflicted(courseNo, period, cartItems)
      ? 'conflict'
      : ((course.color as ColorVariant) ?? 'primary')}

    {#if !isNaN(startTime) && !isNaN(endTime)}
      <TimetableCourseCard
        onclick={() => onclick(course.id)}
        course={{
          abbrName: course.course.abbrName,
          name: course.course.courseNameEn,
          code: course.courseNo,
          bldg: period.building ?? '',
          room: period.room ?? '',
          section: course.sectionNo,
        }}
        {color}
        length={parsePeriodTime(period.periodEnd) -
          parsePeriodTime(period.periodStart)}
        row={getColumnFromDay(period.dayOfWeek as Day)}
        col={parsePeriodTime(period.periodStart) - timetableStart}
      />
    {/if}
  {/each}
{/if}
