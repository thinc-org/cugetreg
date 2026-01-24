<script lang="ts">
	import { Star, StarHalf } from '@lucide/svelte';

	import { cn } from '@cugetreg/utils';

	let {
		rating,
		size = 16,
		gap = 4,
		class: className = undefined
	}: {
		rating: number;
		size?: number;
		gap?: number;
		class?: string;
	} = $props();
	// Calculate the number of filled and unfilled stars
	const totalStars: number = 5;
	let filledStars: number = $derived(Math.floor(rating)); // Number of fully filled stars
	let hasHalfStar: boolean = $derived(rating % 1 !== 0); // Determine if there's a half star
</script>

<div
	class={cn('text-primary relative inline-flex', className)}
	style={`width: ${totalStars * size + (totalStars - 1) * gap}px; height: ${size}px;`}
>
	<div class="absolute inset-0 flex flex-row" style={`gap: ${gap}px;`}>
		{#each Array(totalStars) as _, i (i)}
			<Star {size} />
		{/each}
	</div>
	<div class="absolute inset-0 flex flex-row" style={`gap: ${gap}px;`}>
		{#each Array(filledStars) as _, i (i)}
			<Star {size} fill="currentColor" />
		{/each}

		<!-- Optionally render a half star (if applicable) -->
		{#if hasHalfStar}
			<StarHalf {size} fill="currentColor" />
		{/if}
	</div>
</div>
