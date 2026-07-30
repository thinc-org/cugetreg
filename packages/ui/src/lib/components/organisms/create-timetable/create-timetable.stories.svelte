<script context="module" lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import CreateTimetable from './create-timetable.svelte';

	const { Story } = defineMeta({
		title: 'Organism/Create Timetable',
		component: CreateTimetable,
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	const defaultHandleCancel = () => {
		console.log('Cancel clicked');
	};

	const defaultHandleConfirm = () => {
		console.log('Confirm clicked');
	};

	const customHandleCancel = () => {
		alert('Custom cancel action!');
	};

	const customHandleConfirm = () => {
		alert('Custom confirm action!');
	};
</script>

<Story
	name="Default"
	args={{
		onCancel: defaultHandleCancel,
		onConfirm: defaultHandleConfirm
	}}
/>

<Story
	name="With Custom Handlers"
	args={{
		onCancel: customHandleCancel,
		onConfirm: customHandleConfirm
	}}
/>
