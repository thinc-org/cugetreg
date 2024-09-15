<script lang="ts">
  import { Button } from '@repo/ui/button'
  import { Input } from '@repo/ui/input'
  import * as Select from '@repo/ui/input-select'

  let counter = 0

  const onButtonClick = () => {
    counter++
  }
</script>

<h1>Web</h1>

<Button on:click="{onButtonClick}">Button</Button>

{counter}

<div
  class="flex flex-col space-x-0 space-y-10 w-auto h-auto p-10 my-5 border-b-2 border-t-2"
>
  <h1>ตัวอย่าง Input</h1>
  <Input
    placeholder="โปรดกรอกรหัสผ่าน"
    label="รหัสผ่าน"
    desc="กรุณากรอกรหัสผ่านให้ถูกต้อง"
  />
  <Input
    placeholder="โปรดกรอกรหัสผ่าน"
    label="รหัสผ่าน"
    desc="กรุณากรอกรหัสผ่านให้ถูกต้อง"
    state="error"
  />
  <Input placeholder="สำเร็จ" label="รหัสผ่าน" desc="สำเร็จ" state="success" />
  <Input
    placeholder="ฟอร์มนี้ใช้ไม่ได้"
    label="รหัสผ่าน"
    desc="ฟอร์มนี้ใช้ไม่ได้"
    state="disable"
  />
</div>
<div
  class="flex flex-col space-x-0 space-y-10 w-auto h-auto p-10 my-5 border-b-2 border-t-2"
>
  <h1>Select</h1>
  <Select.Root>
    <Select.Trigger class="w-[350px]">
      <Select.Value placeholder="Theme" />
    </Select.Trigger>
    <Select.Content>
      <Select.Item value="light">Light</Select.Item>
      <Select.Item value="dark">Dark</Select.Item>
      <Select.Item value="system">System</Select.Item>
    </Select.Content>
  </Select.Root>
</div>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
