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
  class="w-full h-auto border border-surface-container py-10 px-12 box-border rounded-xl flex flex-col gap-y-8"
>
  <div class="flex flex-row gap-x-6">
    <div class="font-bold text-h3 text-primary">
      {#if !hasHalfStar}
        <span>{rating}.0</span>
      {:else}
        <span>{rating}</span>
      {/if}
    </div>
    <div class="flex flex-row text-h3 text-primary gap-1.5">
      <!-- Render filled stars -->
      {#each Array(filledStars) as _, i}
        <Star fill="currentColor" />
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
  <p
    class="w-full h-auto self-center text-body1 font-sarabun font-regular text-on-surface"
  >
    {content}
  </p>
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
