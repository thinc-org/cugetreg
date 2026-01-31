<script lang="ts">
	interface Props {
		selected: {
			section: string;
			seats: string;
			teacher: string;
			schedule: string;
			room: string;
			type: string;
		};
		handleClick?: () => void;
	}

	let { selected, handleClick }: Props = $props();

	let clicked = $state(false);

	const defaultHandleClick = () => {
		clicked = !clicked;
		console.log('Selected row:', selected);
	};

	const onClick = () => {
		if (handleClick) {
			handleClick();
		} else {
			defaultHandleClick();
		}
	};
</script>

<button
	onclick={onClick}
	class={`rounded-button h-9 w-22 rotate-0 gap-1 border-[1.5px] pt-0.5 pr-5 pl-4 opacity-100 ${
		clicked ? 'border-[#4A70C6]' : 'border-[#EDEDF1]'
	}`}
>
	<div class="flex items-center gap-1">
		<p
			class={`text-button2 align-middle font-[FC_Orbit] font-medium tracking-[0.15px] ${
				clicked ? 'text-[#4A70C6]' : 'text-[#353745]'
			}`}
		>
			เลือก
		</p>

		{#if clicked}
			<svg
				width="13"
				height="10"
				viewBox="0 0 13 10"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="shrink-0"
			>
				<path
					d="M11.6667 1L4.33333 8.33333L1 5"
					stroke="#4A70C6"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{:else}
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="shrink-0"
			>
				<path
					d="M3.33301 8.00016H12.6663M7.99967 3.3335V12.6668"
					stroke="#324376"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
	</div>
</button>
