<script context="module" lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import LoginPopup from './login-popup.svelte';

	const { Story } = defineMeta({
		title: 'Organism/Login Popup',
		component: LoginPopup,
		tags: ['autodocs']
	});
</script>

<Story name="Default" />
