<script>
  import { ThumbsUp } from 'lucide-svelte'
  import { ThumbsDown } from 'lucide-svelte'
  import { Star } from 'lucide-svelte'

  export let content
  export let semester
  export let rating
  export let likesCount
  export let dislikesCount
  // Calculate the number of filled and unfilled stars
  const totalStars = 5
  const filledStars = Math.floor(rating) // Number of fully filled stars
  const hasHalfStar = rating % 1 !== 0 // Determine if there's a half star
  const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0)
</script>

<div
  class="w-[968px] h-[444px] border border-surface-container py-10 px-12 box-border rounded-xl flex flex-col"
>
  <div class="flex flex-row">
    <div class="mr-4 font-bold text-h3 text-primary">
      {#if !hasHalfStar}
        <span>{rating}.0</span>
      {/if}
      {#if hasHalfStar}
        <span>{rating}</span>
      {/if}
    </div>
    <div class="flex flex-row mr-4 text-h3 text-primary gap-1.5">
      <!-- Render filled stars -->
      {#each Array(filledStars) as _, i}
        <Star fill="currentColor" stroke="none" />
      {/each}

      <!-- Optionally render a half star (if applicable) -->
      {#if hasHalfStar}
        <div class="flex gap-0">
          <div class="relative inline-block w-6 h-6 overflow-hidden max-w-3">
            <Star fill="currentColor" />
          </div>
          <div
            class="relative inline-block w-6 h-6 overflow-hidden max-w-3 transform scale-x-[-1]"
          >
            <Star />
          </div>
        </div>
      {/if}

      <!-- Render unfilled stars -->
      {#each Array(emptyStars) as _, i}
        <Star />
      {/each}
    </div>
    <div class="text-subtitle font-sans font-medium">
      {semester}
    </div>
  </div>
  <div
    class="w-[872px] h-[252px] self-center mt-6 text-body1 font-sarabun font-regular"
  >
    {content}
  </div>
  <div class="gap-6 flex flex-row text-subtitle font-sans">
    <div class="flex flex-row font-medium">
      <ThumbsUp class="mr-2 text-neutral-400" />
      {likesCount}
    </div>
    <div class="flex flex-row font-medium">
      <ThumbsDown class="mr-2 text-neutral-400" />
      {dislikesCount}
    </div>
  </div>
</div>
