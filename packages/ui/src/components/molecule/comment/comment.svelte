<script lang="ts">
  import { ThumbsDown, ThumbsUp } from 'lucide-svelte'

  import { RatingStar } from '../../atom/rating-star'

  let {
    content,
    semester,
    rating,
    likesCount,
    dislikesCount,
  }: {
    content: string
    semester: string
    rating: number
    likesCount: number
    dislikesCount: number
  } = $props()
  let hasHalfStar: boolean = $derived(rating % 1 !== 0) // Determine if there's a half star
  let isExpanded: boolean = $state(false)
</script>

<div
  class="h-[320px] w-full lg:h-auto border border-surface-container px-6 py-5 lg:py-10 lg:px-12 box-border rounded-xl flex flex-col gap-y-4
  lg:gap-y-8 overflow-hidden"
  class:h-auto={isExpanded}
>
  <div class="flex flex-row gap-x-6">
    <div class="font-bold text-h3 text-primary">
      {#if !hasHalfStar}
        <span>{rating}.0</span>
      {:else}
        <span>{rating}</span>
      {/if}
    </div>

    <RatingStar {rating} />

    <div class="text-subtitle font-sans font-medium">
      {semester}
    </div>
  </div>

  <div
    class="h-[200px] lg:h-auto relative overflow-hidden"
    class:h-fit={isExpanded}
    class:overflow-visible={isExpanded}
  >
    <p
      class="w-full h-auto self-center text-body1 font-sarabun font-regular text-on-surface"
    >
      {content}
    </p>

    <!-- Button to toggle view -->
    <button
      class="absolute bottom-0 right-0 underline text-button1 text-primary lg:hidden pb-1 pt-1 pl-2 bg-surface
"
      onclick={() => (isExpanded = !isExpanded)}
    >
      {#if isExpanded}
        ดูน้อยลง
      {:else}
        ดูเพ่ิมเติม
      {/if}
    </button>
  </div>

  <div class="gap-6 flex flex-row text-subtitle font-sans">
    <div class="flex flex-row font-medium gap-x-2">
      <ThumbsUp class="text-neutral-400" />
      {likesCount}
    </div>
    <div class="flex flex-row font-medium gap-x-2">
      <ThumbsDown class="text-neutral-400" />
      {dislikesCount}
    </div>
  </div>
</div>
