<script lang="ts">
  import { Collapsible } from 'bits-ui'
  import { ChevronDown } from 'lucide-svelte'
  import type { Snippet } from 'svelte'
  import { slide } from 'svelte/transition'

  interface Props {
    name: string
    children?: Snippet
  }

  let { name = '', children }: Props = $props()
</script>

<Collapsible.Root class="relative">
  <div class="flex flex-row md:gap-1">
    <p class="text-primary text-button1 font-medium">{name}</p>
    <Collapsible.Trigger>
      <ChevronDown color="#4A70C6" class="hidden min-[900px]:block" />
    </Collapsible.Trigger>
  </div>
  <Collapsible.Content class="absolute top-10 -left-20" transition={slide}>
    {@render children?.()}
  </Collapsible.Content>
</Collapsible.Root>
