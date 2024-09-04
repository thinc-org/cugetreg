<script lang="ts">
  import { Button } from '@repo/ui/button'
  import { Input } from '@repo/ui/input'

  let counter = 0

  const onButtonClick = () => {
    counter++
  }
</script>

<h1>Web</h1>

<Button on:click="{onButtonClick}">Button</Button>

{counter}

<Input placeholder="Input" />

<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
