<!-- To be implemented: add props (isLoggedIn, ...) -->
<!-- To be implemented: make responsive -->
<script lang="ts">
  import { Moon, Search } from 'lucide-svelte'

  import { cn } from '../../utils'
  import Button from '../button/button.svelte'
  import IconButton from '../icon-button/icon-button.svelte'
  import Input from '../input/input.svelte'
  import Logo from '../logo/cugetreg/DarkFull.svelte'
  import GitHubMark from '../logo/vendor/GitHubMark.svelte'

  let navItems = ['ค้นหาวิชา', 'จัดตารางเรียน', 'เกี่ยวกับ']
  let selected = 'ค้นหาวิชา'
</script>

<div
  class="py-3 px-10 flex justify-between items-center z-50 border-b-2 border-surface-container-low"
>
  <div class="flex flex-row gap-6">
    <Logo class="w-32 h-10" />
    <div class="relative h-full">
      <Search
        class="absolute my-auto right-4 top-[32%]"
        size="16"
        color="hsl(var(--neutral-400) / var(--tw-text-opacity, 1))"
        strokeWidth="3.5"
      />
      <Input
        placeholder="ค้นหาวิชา"
        class="w-56 placeholder:text-neutral-400"
      />
    </div>
  </div>
  <!-- To be fix: this section should be in the middle of the screen -->
  <div
    class="absolute left-1/2 transform -translate-x-1/2 flex flex-row justify-center items-center gap-4"
  >
    <!-- To be implemented: add page from navItems-->
    {#each navItems as item}
      <a
        class="{cn(
          'text-neutral-500 text-xl w-28 text-center cursor-pointer hover:text-neutral-800',
          selected === item && 'text-primary',
        )}"
        on:click="{() => (selected = item)}"
        href="/"
      >
        {item}
      </a>
    {/each}
  </div>
  <div class="flex flex-row justify-between items-center gap-4">
    <GitHubMark class="w-8 h-8 text-neutral-500" />
    <IconButton color="neutral"><Moon strokeWidth="3" size="16" /></IconButton>
    <!-- To be implemented: add real href in Button -->
    <Button href="login" class="font-normal w-28">เข้าสู่ระบบ</Button>
  </div>
</div>
