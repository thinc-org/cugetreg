<script>
  import { Star } from 'lucide-svelte'
  let { rating } = $props()
  // Calculate the number of filled and unfilled stars
  const totalStars = 5
  let filledStars = $derived(Math.floor(rating)) // Number of fully filled stars
  let hasHalfStar = $derived(rating % 1 !== 0) // Determine if there's a half star
  let emptyStars = $derived(totalStars - filledStars - (hasHalfStar ? 1 : 0))
</script>

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
  {#each Array(emptyStars) as _, __}
    <Star />
  {/each}
</div>
