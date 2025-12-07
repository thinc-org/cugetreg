<script lang="ts">
  import { Star } from 'lucide-svelte'
  let { rating }: { rating: number } = $props()
  // Calculate the number of filled and unfilled stars
  const totalStars: number = 5
  let filledStars: number = $derived(Math.floor(rating)) // Number of fully filled stars
  let hasHalfStar: boolean = $derived(rating % 1 !== 0) // Determine if there's a half star
  let emptyStars: number = $derived(
    totalStars - filledStars - (hasHalfStar ? 1 : 0),
  )
</script>

<div class="flex flex-row text-h3 text-primary gap-1.5">
  {#each Array(filledStars) as _}
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
  {#each Array(emptyStars) as _}
    <Star />
  {/each}
</div>
