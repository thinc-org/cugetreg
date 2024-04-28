<script lang="ts">
  import { toggleDarkMode } from '$lib/utils/toggleDarkMode'
  import { Button, type ButtonEvents } from '$ui/button'
  import { Input } from '$ui/input'
</script>

<div class="container">
  <h1 class="text-primary">Welcome to CU Get Reg</h1>
  <Button on:click={toggleDarkMode} class="bg-primary">Toggle Dark Mode</Button>
  <Input placeholder="Enter your name" />
</div>
