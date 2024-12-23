<script lang="ts">
  import * as Accordion from '@repo/ui/accordion'
  import { Button } from '@repo/ui/button'
  import { Chip } from '@repo/ui/chip'
  import { CourseCard } from '@repo/ui/course-card'
  import { DayChip } from '@repo/ui/day-chip'
  import { GenedChip } from '@repo/ui/gened-chip'
  import { Input } from '@repo/ui/input'
  import { Label } from '@repo/ui/label'
  import { Select } from '@repo/ui/select'
  import { RecommendedTag } from '@repo/ui/recommended-tag'
  
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
  <div class="space-y-2">
    <Label label="เลือกตัวเลือก" />
    <Select
      state="default"
      placeholder="โปรดเลือกตัวเลือก"
      items="{['option1', 'option2']}"
    />
    <Label label="กรุณาเลือกตัวเลือกให้ถูกต้อง" />
  </div>
  <div class="space-y-2">
    <Label label="เลือกตัวเลือก" />
    <Select
      placeholder="โปรดเลือกตัวเลือก"
      state="error"
      items="{['option1', 'option2']}"
    />
    <Label label="กรุณาเลือกตัวเลือกให้ถูกต้อง" state="error" />
  </div>
  <div class="space-y-2">
    <Label label="เลือกตัวเลือก" />
    <Select
      placeholder="โปรดเลือกตัวเลือก"
      state="success"
      items="{['option1', 'option2']}"
    />
    <Label label="กรุณาเลือกตัวเลือกให้ถูกต้อง" state="success" />
  </div>
  <div class="space-y-2">
    <Label label="เลือกตัวเลือก" />
    <Select
      placeholder="โปรดเลือกตัวเลือก"
      state="disable"
      items="{['option1', 'option2']}"
    />
    <Label label="กรุณาเลือกตัวเลือกให้ถูกต้อง" state="disable" />
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

<h1>Testtsetst</h1>
<CourseCard recommended="{true}" class="mt-4" />

<h1>RecommendedTag</h1>
<RecommendedTag />

<Accordion.Root>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It adheres to the WAI-ARIA design pattern.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
