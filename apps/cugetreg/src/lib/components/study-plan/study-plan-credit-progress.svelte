<script lang="ts">
  import { cn } from '@cugetreg/utils';

  interface StudyPlanCreditProgressProps {
    label: string;
    current: number;
    target: number;
    color: string;
    class?: string;
  }

  let {
    label,
    current,
    target,
    color,
    class: className = '',
  }: StudyPlanCreditProgressProps = $props();

  const progress = $derived(
    target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0,
  );
</script>

<div class={cn('flex w-full flex-col gap-2', className)}>
  <div class="flex items-center justify-between text-sm text-[#353745]">
    <span>{label}</span>
    <span>{current}/{target}</span>
  </div>

  <div class="relative flex h-2 w-full justify-start rounded-full bg-[#D6D7E1]">
    <div
      class="h-full rounded-full"
      style:width={`${progress}%`}
      style:background-color={color}
    ></div>
  </div>
</div>
