<script lang="ts">
	import { ThumbsDown, ThumbsUp } from '@lucide/svelte';

	import { RatingStar } from '../../atoms/rating-star';

	let {
		content,
		semester,
		rating,
		likesCount,
		dislikesCount,
		facultyMajor
	}: {
		content: string;
		semester: string;
		rating: number;
		likesCount: number;
		dislikesCount: number;
		facultyMajor?: string;
	} = $props();
	let hasHalfStar: boolean = $derived(rating % 1 !== 0); // Determine if there's a half star
	let isExpanded: boolean = $state(false);
</script>

<div
	class="border-surface-container box-border flex h-[320px] w-full flex-col gap-y-4 rounded-xl border px-6 py-5 lg:h-auto lg:gap-y-8
  lg:px-12 lg:py-10"
	class:h-auto={isExpanded}
>
	<div class="flex flex-row items-center gap-x-6">
		<div class="text-h3 text-primary font-bold">
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
		class="flex flex-col gap-2 lg:h-auto lg:flex-none lg:overflow-visible"
		class:h-[220px]={!isExpanded} class:h-auto={isExpanded}    
	>
		{#if facultyMajor}
			<div class="text-on-surface/60 text-body2 font-sans">
				{facultyMajor}
			</div>
		{/if}

		<div class="flex-1 h-full w-full lg:h-auto lg:overflow-visible" class:overflow-hidden={!isExpanded}>
            <p class="text-body1 font-sarabun font-regular text-on-surface w-full">
                {content}
            </p>
        </div>

		<div class="mt-auto flex flex-col gap-4">
			<!-- Button to toggle view -->
			<button
				class="text-button1 self-start text-primary underline lg:hidden"
				onclick={() => (isExpanded = !isExpanded)}
			>
				{#if isExpanded}
					ดูน้อยลง
				{:else}
					ดูเพ่ิมเติม
				{/if}
			</button>

			<div class="text-subtitle flex flex-row gap-6 font-sans">
				<div class="flex flex-row gap-x-2 font-medium">
					<ThumbsUp class="text-neutral-400" />
					{likesCount}
				</div>
				<div class="flex flex-row gap-x-2 font-medium">
					<ThumbsDown class="text-neutral-400" />
					{dislikesCount}
				</div>
			</div>
		</div>
	</div>
</div>
