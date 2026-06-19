<script lang="ts">
	import { ChevronRight, Clock, Star, NotebookPen } from '@lucide/svelte';

	import { RatingStar } from '../../atoms/rating-star';

	import { Status } from '$lib/utils';

	interface ReviewItem {
		code: string;
		name: string;
		tag: string;
		status: Status;
		rating: number;
		term: string;
	}

	interface Props {
		overviewTitle?: string;
		latestTitle?: string;
		histogram?: number[];
		overallRating?: number;
		reviews?: ReviewItem[];
	}

	const defaultReviews: ReviewItem[] = [
		{
			code: '0123104',
			name: 'CON PDG PEACE CONFWV',
			tag: 'หมวดมนุษย์',
			status: Status.APPROVED,
			rating: 4,
			term: 'ภาคต้น 2566'
		},
		{
			code: '0123101',
			name: 'PARAGRAPH WRITING',
			tag: 'หมวดมนุษย์',
			status: Status.REJECTED,
			rating: 3,
			term: 'ภาคปลาย 2565'
		},
		{
			code: '0123101',
			name: 'PARAGRAPH WRITING',
			tag: 'หมวดมนุษย์',
			status: Status.APPROVED,
			rating: 3,
			term: 'ภาคปลาย 2566'
		},
		{
			code: '2190201',
			name: 'COM PROG',
			tag: 'หมวดวิทย์',
			status: Status.PENDING,
			rating: 2.5,
			term: 'ภาคปลาย 2566'
		}
	];

	let {
		overviewTitle = 'ภาพรวมรีวิว',
		latestTitle = 'รีวิวล่าสุด',
		histogram = undefined,
		overallRating = undefined,
		reviews = defaultReviews
	}: Props = $props();

	let showAll = $state(false);

	const histogramData = $derived.by(() => {
		if (histogram && histogram.length > 0) {
			return histogram;
		}

		const counts = new Array(11).fill(0);
		for (const review of reviews) {
			const ratingValue = Number(review.rating);
			if (Number.isNaN(ratingValue)) {
				continue;
			}
			const clamped = Math.min(5, Math.max(0, ratingValue));
			const index = Math.round(clamped * 2);
			counts[index] += 1;
		}
		return counts;
	});

	const averageRating = $derived.by(() => {
		if (typeof overallRating === 'number') {
			return overallRating;
		}
		if (!reviews.length) {
			return 0;
		}
		const sum = reviews.reduce((total, review) => total + review.rating, 0);
		return Math.round((sum / reviews.length) * 2) / 2;
	});

	const normalizeRating = (value: number) => Math.min(5, Math.max(0, Math.round(value * 2) / 2));

	const tagClass = (tag: string) => {
		if (tag === 'หมวดวิทย์') {
			return 'border-orange-500 text-orange-700';
		}
		return 'border-pink-500 text-pink-700';
	};

	const maxValue = $derived(Math.max(...histogramData, 1));

	const visibleReviews = $derived(showAll ? reviews : reviews.slice(0, 3));
</script>

<div
	class="border-surface-container-low bg-surface-container-lowest text-on-surface w-full max-w-md rounded-3xl border p-6"
>
	<div class="text-body2 flex items-center gap-2 font-semibold">
		<Star size="18" strokeWidth="2.5" />
		<p>{overviewTitle}</p>
	</div>

	<div class="mt-4 flex items-end">
		<div class="text-primary flex h-16 shrink-0 items-end">
			<Star size="18" strokeWidth="1.5" fill="currentColor" class="translate-y-[2px]" />
		</div>
		<div class="flex h-16 flex-1 items-end justify-center gap-1">
			{#each histogramData as value, i (i)}
				<div
					class="bg-surface-container-high w-5"
					style={`height: ${Math.max(8, (value / maxValue) * 64)}px`}
				></div>
			{/each}
		</div>
		<div class="text-primary flex h-16 shrink-0 items-end">
			<RatingStar rating={5} size={14} gap={4} />
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
					onclick={() => (showAll = !showAll)}
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
			<div class="mt-4 flex flex-col gap-4">
				{#each visibleReviews as review, i (i)}
					<div class="flex flex-col gap-2">
						<div class="flex items-center justify-between gap-3">
							<p class="text-body2 font-normal">
								{review.code}
								{review.name}
							</p>
							<span
								class={`text-caption rounded-full border px-3 py-1 font-semibold ${tagClass(
									review.tag
								)}`}
							>
								{review.tag}
							</span>
						</div>
						<div class="flex items-center gap-3">
							{#if review.status === Status.PENDING}
								<span
									class="text-caption rounded-full border border-amber-600 bg-amber-100 px-3 py-1 font-normal text-amber-600"
								>
									กำลังรออนุมัติ
								</span>
							{:else if review.status === Status.REJECTED}
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
		{/if}
	</div>
</div>
