<script lang="ts">
  import { Collapsible } from 'bits-ui'
  import { ChevronDown } from 'lucide-svelte'
  import { slide } from 'svelte/transition'

  export let name = undefined
</script>

<Collapsible.Root class="relative">
  <div class="flex flex-row md:gap-2">
    <p class="text-primary text-lg">{name}</p>
    <Collapsible.Trigger>
      <ChevronDown color="#4A70C6" class="hidden md:block" />
    </Collapsible.Trigger>
  </div>
  <Collapsible.Content
    class="absolute top-8 right-0 w-28 bg-surface-container border-b-neutral-400 rounded-md"
    transition="{slide}"
  >
    <slot />
  </Collapsible.Content>
</Collapsible.Root>
