<script lang="ts">
  import { Sparkles } from 'lucide-svelte'

  import { cn } from '../../utils'

  let className: string | undefined | null = undefined

  export { className as class }
</script>

<div
  class="{cn(
    'inline-flex items-center justify-center relative text-neutral-white bg-tangerine-500 py-[2px] px-6 rounded-tl-xl rounded-br-xl z-30',
    className,
  )}"
  {...$$restProps}
>
  <Sparkles class="mr-2" size="16" />
  แนะนำสำหรับคุณ
  <div
    class="absolute right-0 top-0 translate-x-full border-b-8 border-b-tangerine-700 border-r-8 border-r-neutral-white"
  ></div>
</div>
