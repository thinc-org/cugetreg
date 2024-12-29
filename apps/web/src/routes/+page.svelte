<script lang="ts">
  import * as Accordion from '@repo/ui/atom/accordion'
  import { Button } from '@repo/ui/atom/button'
  import { Chip } from '@repo/ui/atom/chip'
  import { DayChip } from '@repo/ui/atom/day-chip'
  import { GenedChip } from '@repo/ui/atom/gened-chip'
  import { Input } from '@repo/ui/atom/input'
  import { RecommendedTag } from '@repo/ui/atom/recommended-tag'
  import { CourseCard } from '@repo/ui/molecule/course-card'
  import { Navbar } from '@repo/ui/organism/navbar'

  let counter = $state(0)

  const onButtonClick = () => {
    counter++
  }
</script>

<Navbar />
<Navbar
  isLoggedIn
  name="Firstname Lastname"
  imageUrl="https://s3-alpha-sig.figma.com/img/9700/7ce5/9fb43f41dfa4552821c5c7bc837a7e84?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=UWp0COPKxbiGnZUbN7-EQF0v8PznPXZzvPZxc3mryo-Ht7j~6qUJDaq3uzCuh-z-baS3x6SeJ8omqtDT6ECz6P9KLdXGXtSex5x-2zgezbPQAGBym2aQEuZ4bfn9hCQ6SsImZaG30l5c9Xw1wQxAiuTdPfXP3uPIfZJXesdXB73tKGKNGPv93MDrVpE2ZSaA5hhkkFyhhbqgiRpNEuZ4GMqatcVzjcl5xyhgbRHR2o03eXbvHUsFgzCD-pTFnofOB6pYYzqsroWM3pmCu9NsDXLCDgRNdsGgSczwTwj6vLoWIMuvmEkTcVcHc-0JRGzo4XRpfrJ2X0jd-hTU41H0kQ__"
  id="6XXXXXXXXX"
/>

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

<a href="/dbdemo">Click to go to DB Demo</a>
