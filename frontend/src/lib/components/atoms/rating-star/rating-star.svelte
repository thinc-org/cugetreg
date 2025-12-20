<script lang="ts">
    import { Star, StarHalf } from "lucide-svelte";
    let { rating }: { rating: number } = $props();
    // Calculate the number of filled and unfilled stars
    const totalStars: number = 5;
    let filledStars: number = $derived(Math.floor(rating)); // Number of fully filled stars
    let hasHalfStar: boolean = $derived(rating % 1 !== 0); // Determine if there's a half star
</script>

<div class="relative flex flex-row text-h3 text-primary gap-1.5">
    <div class="absolute inset-0 flex flex-row">
        {#each Array(totalStars) as _}
            <Star />
        {/each}
    </div>
    <div class="absolute inset-0 flex flex-row">
        {#each Array(filledStars) as _}
            <Star fill="currentColor" />
        {/each}

        <!-- Optionally render a half star (if applicable) -->
        {#if hasHalfStar}
            <StarHalf fill="currentColor" />
        {/if}
    </div>
</div>
