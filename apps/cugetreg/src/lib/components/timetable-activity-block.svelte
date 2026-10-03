<script lang="ts">
  import { getColumnFromDay } from '$lib/mapper';
  import {
    parsePeriodTime,
    TIMETABLE_DEFAULT_START,
  } from '$lib/utils/schedule';

  import { TimetableCourseCard } from '@cugetreg/ui/atoms/timetable';
  import type { ColorVariant, Day } from '@cugetreg/utils/types';
  import type { ActivityItem } from '@cugetreg/zod-schemas/activity-response';

  interface TimetableActivityBlock {
    activity: ActivityItem;
    onclick?: (id: string) => void;
    /** First hour shown on the timetable; blocks are offset from it. */
    startTime?: number;
  }

  let {
    activity,
    onclick = () => {},
    startTime: timetableStart = TIMETABLE_DEFAULT_START,
  }: TimetableActivityBlock = $props();

  const start = $derived(parsePeriodTime(activity.periodStart));
  const end = $derived(parsePeriodTime(activity.periodEnd));
  const row = $derived(getColumnFromDay(activity.dayOfWeek as Day));
</script>

{#if !activity.hidden && !isNaN(start) && !isNaN(end) && row !== undefined}
  <TimetableCourseCard
    role="button"
    tabindex="0"
    aria-label={activity.title}
    onclick={() => onclick(activity.id)}
    onkeydown={(e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') onclick(activity.id);
    }}
    course={{ name: activity.title, abbrName: activity.title }}
    color={(activity.color as ColorVariant | null) ?? 'primary'}
    length={end - start}
    {row}
    col={start - timetableStart}
  />
{/if}
