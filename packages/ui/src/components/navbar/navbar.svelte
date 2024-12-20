<script lang="ts">
  import { Moon, Search } from 'lucide-svelte'

  import { cn } from '../../utils'
  import Button from '../button/button.svelte'
  import Collapsible from '../collapsible/collapsible.svelte'
  import IconButton from '../icon-button/icon-button.svelte'
  import Input from '../input/input.svelte'
  import Logo from '../logo/cugetreg/DarkFull.svelte'
  import GitHubMark from '../logo/vendor/GitHubMark.svelte'

  export let isLoggedIn: boolean = false
  export let name: string = undefined
  let navItems = ['ค้นหาวิชา', 'จัดตารางเรียน', 'เกี่ยวกับ']
  let selected = 'ค้นหาวิชา'
</script>

<div
  class=" h-20 py-3 px-5 md:py-3 md:px-10 flex justify-between items-center z-50 border-b-2 border-surface-container-low"
>
  <div class="flex flex-row gap-6 items-center">
    <Logo class="w-24 h-8 md:w-32 md:h-10" />
    <div class="hidden md:flex relative">
      <Search
        class="absolute right-4 top-[32%]"
        size="16"
        color="#898EA7"
        strokeWidth="3.5"
      />
      <Input
        placeholder="ค้นหาวิชา"
        class="w-56 bg-surface-container-lowest placeholder:text-neutral-400"
      />
    </div>
  </div>
  <div
    class="hidden absolute left-1/2 transform -translate-x-1/2 md:flex flex-row justify-center items-center gap-4"
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
    <a
      href="https://github.com/thinc-org/cugetreg"
      target="_blank"
      rel="noreferrer"
      class="hidden md:flex"
    >
      <GitHubMark class="w-8 h-8 text-neutral-500 " />
    </a>
    <IconButton color="neutral" class="hidden md:flex"
      ><Moon strokeWidth="3" size="16" /></IconButton
    >
    {#if isLoggedIn}
      <!-- To be implemented: Collapsible component -->
      <Collapsible {name} />
    {:else}
      <!-- To be implemented: add real href in Button -->
      <Button href="login" class="w-24 md:w-28"
        ><p class="text-xs font-light md:text-base">เข้าสู่ระบบ</p></Button
      >
    {/if}
  </div>
</div>
