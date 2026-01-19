<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import * as Sidebar from './index.ts';

	const { Story } = defineMeta({
		title: 'Organism/Sidebar'
	});

	//Please refer for  to: https://www.shadcn-svelte.com/docs/components/sidebar
</script>

<!-- TODO:  -->
<Story name="Default">
	<Sidebar.Provider>
		<Sidebar.Root>
			<Sidebar.Header>Header</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Group />
				<Sidebar.Group />
			</Sidebar.Content>
			<Sidebar.Footer />
		</Sidebar.Root>
		MAIN PAGE
		<Sidebar.Trigger>Open sidebar</Sidebar.Trigger>
	</Sidebar.Provider>
</Story>
