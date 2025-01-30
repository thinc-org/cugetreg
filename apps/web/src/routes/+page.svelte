<script lang="ts">
  import * as Accordion from '@repo/ui/atom/accordion'
  import { Button } from '@repo/ui/atom/button'
  import { Chip } from '@repo/ui/atom/chip'
  import { DayChip } from '@repo/ui/atom/day-chip'
  import { GenedChip } from '@repo/ui/atom/gened-chip'
  import { Input } from '@repo/ui/atom/input'
  import { RecommendedTag } from '@repo/ui/atom/recommended-tag'
  import { CourseCard } from '@repo/ui/molecule/course-card'
  import { UserDialog } from '@repo/ui/molecule/user-dialog'
  import { Navbar } from '@repo/ui/organism/navbar'

  let counter = $state(0)

  const onButtonClick = () => {
    counter++
  }
</script>

<Navbar isLoggedIn={false} />
<Navbar isLoggedIn name="Testfirstname Lastname" id="6XXXXXXXXX" />

<h1>Web</h1>

<Button onclick={onButtonClick}>Button</Button>

{counter}

<Input placeholder="Input" />

<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<Chip>รหัสผ่าน</Chip>
<Chip
  closable
  onClose={() => {
    console.log('close')
  }}
>
  Closable
</Chip>
<DayChip day="SA" />
<GenedChip type="SC" />

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
</div>

<h1>Testtsetst</h1>
<CourseCard
  recommended={true}
  class="mt-4"
  course={{
    code: '0123101',
    name: 'PARAGRAPH WRITING',
    credit: 3,
    gened: ['HU'],
    seat: 24,
    maxseat: 305,
    review: 14,
    days: ['MO', 'TU', 'WE'],
  }}
/>

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

<UserDialog
  imageUrl="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
  name="Testname Testname"
  id="6XXXXXXXXX"
/>

<a href="/dbdemo">Click to go to DB Demo</a>
