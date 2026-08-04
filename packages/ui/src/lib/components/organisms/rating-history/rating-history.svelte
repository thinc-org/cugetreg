<script lang="ts">
	import { ChevronRight, Clock, LoaderCircle, NotebookPen, Star, StarHalf } from '@lucide/svelte';
	import { onMount, tick } from 'svelte';

	import type { ReviewStatus } from '@cugetreg/zod-schemas/constants';

	import { RatingStar } from '../../atoms/rating-star';

	interface ReviewItem {
		code: string;
		name: string;
		tag: string | null;
		status: ReviewStatus;
		rating: number;
		term: string;
	}

	interface Props {
		overviewTitle?: string;
		latestTitle?: string;
		histogram?: number[];
		reviews?: ReviewItem[];
		hasMore?: boolean;
		loading?: boolean;
		onLoadMore?: () => void;
	}

	let {
		overviewTitle = 'ภาพรวมรีวิว',
		latestTitle = 'รีวิวล่าสุด',
		histogram = undefined,
		reviews = [],
		hasMore = false,
		loading = false,
		onLoadMore
	}: Props = $props();

	let showAll = $state(false);
	let scrollBox: HTMLDivElement | undefined = $state();
	let isMobile = $state(false);

	const LOAD_MORE_THRESHOLD = 120;

	function handleScroll(event: Event) {
		if (!hasMore || loading) return;

		const target = event.currentTarget as HTMLDivElement;
		const distanceFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

		if (distanceFromBottom <= LOAD_MORE_THRESHOLD) {
			onLoadMore?.();
		}
	}

	async function toggleShowAll() {
		showAll = !showAll;

		await tick();
		if (showAll && scrollBox) {
			scrollBox.scrollTop = 0;
		}
	}

	$effect(() => {
		reviews.length;

		if (!showAll || !hasMore || loading || !scrollBox) return;

		if (scrollBox.scrollHeight <= scrollBox.clientHeight) {
			onLoadMore?.();
		}
	});

	onMount(() => {
		const isMobileQuery = window.matchMedia('(max-width: 768px)');
		isMobile = isMobileQuery.matches;

		const handleMediaQueryChange = (event: MediaQueryListEvent) => {
			isMobile = event.matches;
		};

		isMobileQuery.addEventListener('change', handleMediaQueryChange);

		return () => {
			isMobileQuery.removeEventListener('change', handleMediaQueryChange);
		};
	});

	const histogramData = $derived.by(() => {
		if (histogram && histogram.length > 0) {
			return histogram;
		}

		const counts = new Array(10).fill(0);
		for (const review of reviews) {
			const ratingValue = Number(review.rating);
			if (Number.isNaN(ratingValue)) {
				continue;
			}
			const clamped = Math.min(5, Math.max(0, ratingValue));
			const index = Math.round(clamped * 2);
			counts[index - 1] += 1;
		}
		return counts;
	});

	const normalizeRating = (value: number) => Math.min(5, Math.max(0, Math.round(value * 2) / 2));

	const tagClass = (tag: string) => {
		if (tag === 'หมวดวิทย์') {
			return 'border-orange-500 text-orange-700';
		}
		if (tag === 'หมวดมนุษย์') {
			return 'border-pink-500 text-pink-700';
		}
		if (tag === 'หมวดสังคม') {
			return 'border-green-500 text-green-700';
		}
		return 'border-purple-500 text-purple-700';
	};

	const maxValue = $derived(Math.max(...histogramData, 1));

	const visibleReviews = $derived(showAll ? reviews : reviews.slice(0, 3));
</script>

<div
	class="border-surface-container-low bg-surface-container-lowest text-on-surface w-full max-w-md rounded-3xl border p-6 md:max-w-xl lg:max-w-lg"
>
	<div class="text-body2 flex items-center gap-2 font-semibold">
		<Star size="18" strokeWidth="2.5" />
		<p>{overviewTitle}</p>
	</div>

	<div class="mt-4 flex items-end justify-start gap-x-1.5">
		<div class="text-primary flex h-16 shrink-0 items-end">
			<Star strokeWidth={1.5} class="transition-y-[2px] absolute size-3.5 md:size-4" />
			<StarHalf
				fill="currentColor"
				strokeWidth={1.5}
				class="transition-y-[2px] absolute size-3.5 md:size-4"
			/>
		</div>
		<div class="ml-2 flex h-16 flex-1 items-end justify-center gap-x-1">
			{#each histogramData as value, i (i)}
				<div
					class="bg-surface-container-high w-1/14 md:w-1/12 lg:w-1/14 xl:w-1/12"
					style={`height: ${Math.max(8, (value / maxValue) * 64)}px`}
				></div>
			{/each}
		</div>
		<div class="text-primary flex h-16 shrink-0 items-end">
			<RatingStar rating={5} size={isMobile ? 14 : 16} gap={4} />
		</div>
	</div>

	<div class="border-surface-container-low mt-6 border-t pt-4">
		<div class="flex items-center justify-between">
			<div class="text-body2 flex items-center gap-2 font-semibold">
				<Clock size="18" strokeWidth="2.5" />
				<p>{latestTitle}</p>
			</div>
			{#if reviews.length}
				<button
					type="button"
					class="text-on-surface"
					onclick={toggleShowAll}
					aria-label="Toggle all reviews"
				>
					<ChevronRight
						size="18"
						strokeWidth="2.5"
						class={showAll ? 'rotate-90 transition-transform' : 'transition-transform'}
					/>
				</button>
			{/if}
		</div>

		{#if !reviews.length}
			<div class="flex items-center justify-center p-3">
				<NotebookPen size={52} strokeWidth={1.5} class="text-blue-500" />
			</div>

			<div class="flex w-full flex-col items-center gap-1.5 px-4">
				<h2 class="text-center text-lg font-bold tracking-wide text-gray-800">
					เริ่มเขียนรีวิวแรก
				</h2>
				<p class="w-full text-center text-xs leading-relaxed text-gray-500">
					เริ่มเขียนรีวิวแรกของคุณเพื่อแบ่งปันประสบการณ์ที่น่าจดจำกับวิชานั้น ๆ
					และดูภาพรวมตารางเรียนทั้งหมดที่คุณสร้างไว้ในหน้าโปรไฟล์นี้
				</p>
			</div>
		{:else}
			<div
				bind:this={scrollBox}
				onscroll={handleScroll}
				class={`mt-4 flex flex-col gap-4 ${showAll ? 'max-h-64 overflow-y-auto sm:max-h-72' : ''}`}
			>
				{#each visibleReviews as review, i (i)}
					<div class="flex flex-col gap-2">
						<div class="flex items-center justify-between gap-3">
							<p class="text-body2 font-normal">
								{review.code}
								{review.name}
							</p>
							{#if review.tag}
								<span
									class={`text-caption rounded-full border px-3 py-1 font-semibold ${tagClass(
										review.tag
									)}`}
								>
									{review.tag}
								</span>
							{/if}
						</div>
						<div class="flex items-center gap-3">
							{#if review.status === 'PENDING'}
								<span
									class="text-caption rounded-full border border-amber-600 bg-amber-100 px-3 py-1 font-normal text-amber-600"
								>
									กำลังรออนุมัติ
								</span>
							{:else if review.status === 'REJECTED'}
								<span
									class="text-caption rounded-full border border-red-600 bg-red-100 px-3 py-1 font-normal text-red-600"
								>
									ไม่อนุมัติ
								</span>
							{/if}
							<RatingStar rating={normalizeRating(review.rating)} size={16} gap={4} />
							<p class="text-caption text-on-surface/60">
								{review.term}
							</p>
						</div>
					</div>
				{/each}
			</div>

			{#if showAll}
				{#if loading && hasMore}
					<div class="flex items-center justify-center py-3">
						<LoaderCircle class="animate-spin" size={40} />
					</div>
				{/if}
			{/if}
		{/if}
	</div>
</div>
