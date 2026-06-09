<script lang="ts">
	import StatusChip from '$lib/components/atoms/status-chip/status-chip.svelte';

	import { ThumbsDown, ThumbsUp } from '@lucide/svelte';

	import { RatingStar } from '../../atoms/rating-star';

	interface CommentProps {
		content: string;
		semester: string;
		rating: number;
		likesCount: number;
		dislikesCount: number;
		facultyMajor?: string;
		reaction?: 'L' | 'D';
		status: 'REJECTED' | 'PENDING' | 'APPROVED';

		onLike: () => void;
		onDislike: () => void;
	}

	let {
		content,
		semester,
		rating,
		likesCount,
		dislikesCount,
		facultyMajor,
		status,

		reaction,

		onLike,
		onDislike
	}: CommentProps = $props();
	let hasHalfStar: boolean = $derived(rating % 1 !== 0); // Determine if there's a half star
	let isExpanded: boolean = $state(false);
</script>

<div
	class="border-surface-container box-border flex h-[320px] w-full flex-col gap-y-4 overflow-hidden rounded-xl border px-6 py-5 lg:h-auto lg:gap-y-8
  lg:px-12 lg:py-10"
	class:h-auto={isExpanded}
>
	<div class="flex flex-row items-center justify-between">
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

		<div class={status === 'APPROVED' ? 'hidden' : ''}>
			<StatusChip variant={status} />
		</div>
	</div>

	<div class="flex flex-col gap-2">
		{#if facultyMajor}
			<div class="text-on-surface/60 text-body2 font-sans">
				{facultyMajor}
			</div>
		{/if}

		<div
			class="relative h-[200px] overflow-hidden lg:h-auto"
			class:h-fit={isExpanded}
			class:overflow-visible={isExpanded}
		>
			<p class="text-body1 font-sarabun font-regular text-on-surface h-auto w-full self-center">
				{content}
			</p>

			<!-- Button to toggle view -->
			<button
				class="text-button1 text-primary bg-surface absolute right-0 bottom-0 pt-1 pb-1 pl-2 underline lg:hidden
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
	</div>

	<div class="text-subtitle flex flex-row gap-6 font-sans">
		<div class="flex flex-row gap-x-2 font-medium">
			<button class="hover:cursor-pointer" onclick={onLike}>
				<ThumbsUp
					data-fill={reaction === 'L'}
					class="text-neutral-400 data-[fill=true]:fill-neutral-400"
				/>
			</button>
			{likesCount}
		</div>
		<div class="flex flex-row gap-x-2 font-medium">
			<button class="hover:cursor-pointer" onclick={onDislike}>
				<ThumbsDown
					data-fill={reaction === 'D'}
					class="text-neutral-400 data-[fill=true]:fill-neutral-400"
				/>
			</button>
			{dislikesCount}
		</div>
	</div>
</div>
