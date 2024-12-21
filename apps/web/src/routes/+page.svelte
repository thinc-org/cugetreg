<script lang="ts">
  import { Button } from '@repo/ui/button'
  import { Chip } from '@repo/ui/chip'
  import { DayChip } from '@repo/ui/day-chip'
  import { GenedChip } from '@repo/ui/gened-chip'
  import { Input } from '@repo/ui/input'
  import { Label } from '@repo/ui/label'
  let counter = 0

  const onButtonClick = () => {
    counter++
  }

  import { Select } from '@repo/ui/select'
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
  <div>
    <Label label="เลือกตัวเลือก" />
    <Select
      placeholder="โปรดเลือกตัวเลือก"
      items="{['option1', 'option2']}"
      desc="กรุณาเลือกตัวเลือกให้ถูกต้อง"
    />
  </div>
  <div>
    <Label label="เลือกตัวเลือก" />
    <Select
      placeholder="โปรดเลือกตัวเลือก"
      state="error"
      items="{['option1', 'option2']}"
      desc="กรุณาเลือกตัวเลือกให้ถูกต้อง"
    />
  </div>
  <div>
    <Label label="เลือกตัวเลือก" />
    <Select
      placeholder="โปรดเลือกตัวเลือก"
      state="success"
      items="{['option1', 'option2']}"
      desc="กรุณาเลือกตัวเลือกให้ถูกต้อง"
    />
  </div>
  <div>
    <Label label="เลือกตัวเลือก" />
    <Select
      placeholder="โปรดเลือกตัวเลือก"
      state="disable"
      items="{['option1', 'option2']}"
      desc="กรุณาเลือกตัวเลือกให้ถูกต้อง"
    />
  </div>
</div>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<Chip>รหัสผ่าน</Chip>
<Chip
  closable
  onClose="{() => {
    console.log('close')
  }}">Closable</Chip
>
<DayChip day="SA" />
<GenedChip type="SC" />
