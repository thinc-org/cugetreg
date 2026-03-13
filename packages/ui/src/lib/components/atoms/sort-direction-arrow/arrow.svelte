<script>
	let down = true;
</script>

{#if down}
	<button on:click={() => (down = !down)} class="b">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-arrow-down-icon lucide-arrow-down"
			><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg
		>
	</button>
{:else}
	<button on:click={() => (down = !down)} class="b">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-arrow-up-icon lucide-arrow-up"
			><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg
		>
	</button>
{/if}

<style>
	.b {
		color: hsl(222 52% 53%);
	}
</style>
