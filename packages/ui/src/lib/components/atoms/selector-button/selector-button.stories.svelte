<script context="module" lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { SelectorButton } from './index.js';

	const { Story } = defineMeta({
		title: 'Atom/Selector Button',
		component: SelectorButton,
		tags: ['autodocs'],
		parameters: {
			layout: 'centered'
		}
	});
</script>

<script lang="ts">
	const handleCustomClick = () => {
		alert('Custom click handler triggered!');
	};
</script>

<!-- Default behavior (internal state) -->
<Story name="Default">
	<SelectorButton selected={false} />
</Story>

<!-- With custom click handler -->
<Story name="With Custom Click">
	<SelectorButton selected={true} onClick={handleCustomClick} />
</Story>
