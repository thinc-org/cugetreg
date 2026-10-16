<script lang="ts">
  import * as Select from '@cugetreg/ui/molecules/select';

  import { LETTER_GRADE_POINTS } from './grade';
  import type { GradingType } from './mock-data';

  interface GradeSelectProps {
    gradingType: GradingType;
    value?: string;
    label: string;
    onChange: (value: string | undefined) => void;
  }

  const NO_GRADE = 'X';

  let { gradingType, value, label, onChange }: GradeSelectProps = $props();

  const options = $derived(
    gradingType === 'LETTER' ? Object.keys(LETTER_GRADE_POINTS) : ['S', 'U'],
  );
</script>

<Select.Root
  type="single"
  value={value ?? NO_GRADE}
  onValueChange={(v) => onChange(v === NO_GRADE ? undefined : v)}
>
  <Select.Trigger
    showArrow={false}
    aria-label={label}
    class="ml-auto h-8 w-10 justify-center rounded-none border-0 border-b p-0 text-base focus:ring-0 focus:ring-offset-0 {value
      ? 'text-on-surface border-neutral-900'
      : 'border-neutral-300 text-neutral-300'}"
  >
    <span class="w-full text-center">{value ?? NO_GRADE}</span>
  </Select.Trigger>
  <Select.Content class="min-w-16">
    <Select.Group>
      {#each [NO_GRADE, ...options] as grade (grade)}
        <Select.Item value={grade} label={grade} />
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
