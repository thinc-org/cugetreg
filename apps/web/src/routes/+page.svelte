<script lang="ts">
  import { Button } from '@repo/ui/button'
  import { Chip } from '@repo/ui/chip'
  import { DayChip } from '@repo/ui/day-chip'
  import { GenedChip } from '@repo/ui/gened-chip'
  import { Input } from '@repo/ui/input'
  import { Navbar } from '@repo/ui/navbar'
  import { Footer } from '@repo/ui/organism/footer'

  let counter = 0

  const onButtonClick = () => {
    counter++
  }
</script>

<Navbar />
<Navbar isLoggedIn="{true}" name="เจษฎ์ผยองดู๋" />

<h1>Web</h1>

<Button on:click="{onButtonClick}">Button</Button>

{counter}

<Input placeholder="Input" />

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
<Footer />
