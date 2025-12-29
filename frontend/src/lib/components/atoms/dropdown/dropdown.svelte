<script lang="ts">
  import { cn } from '../../../../utils.js'
  import { dropdownVariants, type Props } from './index'

  export let className: Props['class']
  export let state: Props['state'] = 'default'
  export let value: string = ''
  export let options: { value: string; label: string }[] = []
</script>

<div class="relative w-full">
  <select class={cn(dropdownVariants({ state }), className)} bind:value>
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>

  <!-- Arrow Icon -->
  <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="#898EA7"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</div>
