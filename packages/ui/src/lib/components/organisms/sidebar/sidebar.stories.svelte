<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import * as Sidebar from './index.js';
	import { Home, Settings, Users, Briefcase, LogOut, Search, Bell } from '@lucide/svelte';

	const { Story } = defineMeta({
		title: 'Organism/Sidebar',
		parameters: {
			layout: 'fullscreen'
		}
	});
</script>

{#snippet SidebarInnerContent()}
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					size="lg"
					class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div
						class="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
					>
						<Briefcase class="size-4" />
					</div>
					<div class="grid flex-1 text-left text-sm leading-tight">
						<span class="truncate font-semibold">CUGetReg</span>
						<span class="truncate text-xs">v2</span>
					</div>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton isActive={true}>
							{#snippet child({ props })}
								<a href="##" {...props}>
									<Home class="size-4" />
									<span>Dashboard</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>

					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a href="##" {...props}>
									<Users class="size-4" />
									<span>Team</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>

					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a href="##" {...props}>
									<Settings class="size-4" />
									<span>Settings</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<button
							{...props}
							class="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
						>
							<LogOut class="size-4" />
							<span>Log out</span>
						</button>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
	<Sidebar.Rail />
{/snippet}

{#snippet Layout(
	variant?: 'sidebar' | 'floating' | 'inset',
	side?: 'left' | 'right',
	collapsible?: 'offcanvas' | 'icon' | 'none'
)}
	<div class="bg-background flex h-[600px] w-full overflow-hidden">
		<Sidebar.Provider>
			<Sidebar.Root
				variant={variant ?? 'sidebar'}
				side={side ?? 'left'}
				collapsible={collapsible ?? 'offcanvas'}
			>
				{@render SidebarInnerContent()}
			</Sidebar.Root>

			<Sidebar.Inset>
				<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<Sidebar.Trigger class="-ml-1" />
					<div class="ml-2 flex w-full items-center justify-between">
						<span class="text-sm font-semibold">Dashboard</span>
						<div class="flex gap-4">
							<Search class="text-muted-foreground size-4" />
							<Bell class="text-muted-foreground size-4" />
						</div>
					</div>
				</header>
				<div class="flex flex-1 flex-col gap-4 p-4">
					<div class="grid auto-rows-min gap-4 md:grid-cols-3">
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
					</div>
					<div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
				</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	</div>
{/snippet}

<Story name="Default">
	{@render Layout('sidebar', 'left', 'offcanvas')}
</Story>

<Story name="Floating">
	{@render Layout('floating', 'left', 'offcanvas')}
</Story>

<Story name="Inset">
	{@render Layout('inset', 'left', 'offcanvas')}
</Story>

<Story name="Right Side">
	<div class="bg-background flex h-[600px] w-full overflow-hidden">
		<Sidebar.Provider>
			<Sidebar.Inset>
				<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<div class="ml-2 flex w-full items-center justify-between">
						<span class="text-sm font-semibold">Dashboard</span>
						<div class="flex gap-4">
							<Search class="text-muted-foreground size-4" />
							<Bell class="text-muted-foreground size-4" />
						</div>
					</div>
					<Sidebar.Trigger class="-ml-1" />
				</header>
				<div class="flex flex-1 flex-col gap-4 p-4">
					<div class="grid auto-rows-min gap-4 md:grid-cols-3">
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
					</div>
					<div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
				</div>
			</Sidebar.Inset>

			<Sidebar.Root
				variant="sidebar"
				side="right"
				collapsible="offcanvas"
			>
				{@render SidebarInnerContent()}
			</Sidebar.Root>
		</Sidebar.Provider>
	</div>
</Story>

<Story name="Icon Collapsible">
	{@render Layout('sidebar', 'left', 'icon')}
</Story>
