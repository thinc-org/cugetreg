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
<Navbar isLoggedIn name="Testname testname" />

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
<CourseCard recommended={true} class="mt-4" />

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
