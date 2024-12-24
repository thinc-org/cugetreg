<script lang="ts">
  import * as Accordion from '@repo/ui/accordion'
  import { Button } from '@repo/ui/button'
  import { Chip } from '@repo/ui/chip'
  import { CourseCard } from '@repo/ui/course-card'
  import { DayChip } from '@repo/ui/day-chip'
  import { GenedChip } from '@repo/ui/gened-chip'
  import { Input } from '@repo/ui/input'
  import { RecommendedTag } from '@repo/ui/recommended-tag'

  let counter = $state(0)

  const onButtonClick = () => {
    counter++
  }
</script>

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
