<script lang="ts">
  import { Collapsible } from 'bits-ui'
  import { ChevronDown } from 'lucide-svelte'
  import { slide } from 'svelte/transition'

  export let name = undefined
  let collapseItems = ['TEST1', 'TEST2', 'TEST3']
</script>

<Collapsible.Root class="relative">
  <div class="flex flex-row gap-2">
    <p class="text-primary text-lg">{name}</p>
    <Collapsible.Trigger>
      <ChevronDown color="#4A70C6" />
    </Collapsible.Trigger>
  </div>
  <Collapsible.Content
    class="absolute top-8 right-0 w-28 bg-surface-container border-b-neutral-400 rounded-md"
    transition="{slide}"
  >
    {#each collapseItems as item}
      <div class="p-2">{item}</div>
    {/each}
  </Collapsible.Content>
</Collapsible.Root>
