<script lang="ts">
  import type { Snippet } from 'svelte';

  import * as Sidebar from '@cugetreg/ui/organisms/sidebar';

  interface IconItemsArgs {
    expanded: boolean;
    openPanel: string | null;
    activePanel: string | null;
    toggleExpanded: () => void;
    togglePanel: (id: string, onExpandedScroll?: () => void) => void;
  }

  let {
    children,
    iconItems,
    panelContent,
    showSidebar = true,
    panelWidth = '450px',
    expanded = $bindable(true),
    openPanel = $bindable<string | null>(null),
    activePanel = $bindable<string | null>(null),
  }: {
    children: Snippet;
    iconItems: Snippet<[IconItemsArgs]>;
    panelContent: Snippet<[{ openPanel: string | null; expanded: boolean }]>;
    showSidebar?: boolean;
    panelWidth?: string;
    expanded?: boolean;
    openPanel?: string | null;
    activePanel?: string | null;
  } = $props();
</script>

<Sidebar.Provider
  bind:open={expanded}
  class="relative h-full min-h-0"
  style="--sidebar-width-icon: 4rem; --sidebar-width: {panelWidth};"
>
  {#if showSidebar}
    <Sidebar.Sidebar
      variant="sidebar"
      collapsible="icon"
      class="!absolute z-30 !h-full border-none"
    >
      <Sidebar.Content class="flex-row overflow-visible!">
        <Sidebar.Group
          class="w-(--sidebar-width-icon) shrink-0 items-center border-r border-r-neutral-100 bg-white p-0 pt-[1rem] pb-6 group-data-[variant=floating]:rounded-l-lg md:pt-[1.5rem]"
        >
          <Sidebar.GroupContent>
            <Sidebar.Menu class="gap-6">
              {@render iconItems({
                expanded,
                openPanel,
                activePanel,
                toggleExpanded: () => {
                  expanded = !expanded;
                  if (expanded) openPanel = null;
                },
                togglePanel(id, onExpandedScroll) {
                  activePanel = id;
                  if (expanded) {
                    onExpandedScroll?.();
                  } else {
                    openPanel = openPanel === id ? null : id;
                  }
                },
              })}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>

        {#if openPanel || expanded}
          {#if !expanded}
            <div
              class="fixed inset-0 z-40 bg-black/5"
              onclick={() => (openPanel = null)}
              role="button"
              tabindex="0"
              onkeydown={() => {}}
            ></div>
          {/if}
          <div
            class="bg-surface flex flex-1 flex-col overflow-hidden border-r border-neutral-100 group-data-[state=collapsed]:absolute group-data-[state=collapsed]:top-4 group-data-[state=collapsed]:left-[calc(var(--sidebar-width-icon)+1rem)] group-data-[state=collapsed]:z-50 group-data-[state=collapsed]:max-h-[min(800px,calc(100%-2rem))] group-data-[state=collapsed]:w-[400px] group-data-[state=collapsed]:rounded-3xl group-data-[state=collapsed]:border group-data-[state=collapsed]:shadow-2xl md:px-2 md:pt-0 md:pb-8"
          >
            <div
              class="flex-1 overflow-y-auto pb-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style="overscroll-behavior: contain"
            >
              {@render panelContent({ openPanel, expanded })}
            </div>
          </div>
        {/if}
      </Sidebar.Content>
    </Sidebar.Sidebar>
  {/if}
  <Sidebar.Inset>
    <main
      class="h-full min-w-0 flex-1 overflow-y-auto scroll-smooth bg-white"
      style="overscroll-behavior: contain"
    >
      {@render children()}
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
