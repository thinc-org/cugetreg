<script lang="ts">
	let { target }: { target: HTMLElement | null } = $props();

	let thumbWidth = $state(100);
	let thumbLeft = $state(0);

	function calculateScroll() {
		if (!target) return;
		const { clientWidth, scrollWidth, scrollLeft } = target;

		thumbWidth = (clientWidth / scrollWidth) * 100;
		thumbLeft = (scrollLeft / scrollWidth) * 100;
	}

	$effect(() => {
		if (target) {
			calculateScroll();
			target.addEventListener('scroll', calculateScroll);
			window.addEventListener('resize', calculateScroll);

			return () => {
				target.removeEventListener('scroll', calculateScroll);
				window.removeEventListener('resize', calculateScroll);
			};
		}
	});
</script>

{#if thumbWidth < 100}
	<div class="relative mt-2 h-1 w-full rounded-full bg-gray-200">
		<div
			class="absolute top-0 h-full rounded-full bg-blue-500"
			style="width: {thumbWidth}%; left: {thumbLeft}%;"
		></div>
	</div>
{/if}
