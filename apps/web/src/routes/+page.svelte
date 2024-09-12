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

<Input
  color="error"
  placeholder="โปรดกรอกรหัสผ่าน"
  label="รหัสผ่าน"
  desc="กรุณากรอกรหัสผ่านให้ถูกต้อง"
/>
<Input
  color="error"
  placeholder="โปรดกรอกรหัสผ่าน"
  label="เกิดข้อผิดพลาด"
  desc="กรุณากรอกรหัสผ่านให้ถูกต้อง"
/>

<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
