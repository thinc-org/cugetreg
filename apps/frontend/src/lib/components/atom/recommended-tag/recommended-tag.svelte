<script lang="ts">
  import { Sparkles } from 'lucide-svelte'

  import { cn } from '@repo/utils'

  interface Props {
    class?: string | undefined | null
    [key: string]: unknown
  }

  let { class: className = undefined, ...rest }: Props = $props()
</script>

<div
  class={cn(
    'inline-flex items-center justify-center relative text-neutral-white bg-tangerine-500 py-[2px] px-6 rounded-tl-xl rounded-br-xl',
    className,
  )}
  {...rest}
>
  <Sparkles class="mr-2" size="16" />
  แนะนำสำหรับคุณ
  <div
    class="absolute right-0 top-0 translate-x-full border-b-8 border-b-tangerine-700 border-r-8 border-r-surface"
  ></div>
</div>
