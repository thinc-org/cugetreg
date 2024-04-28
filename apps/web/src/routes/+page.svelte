<script lang="ts">
  import { Button, type ButtonEvents } from '$ui/button'
  import { Input } from '$ui/input'

  const handleOnClick = (event: ButtonEvents['click']) => {
    alert('Hello, world!')
  }
</script>

<div class="container">
  <h1>Welcome to CU Get Reg</h1>
  <Button on:click={handleOnClick}>Click me</Button>
  <Input placeholder="Enter your name" />
</div>
