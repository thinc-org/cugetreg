<script lang="ts">
  import { Menu, Moon, Search, Settings2 } from 'lucide-svelte'

  import { cn } from '../../../utils'
  import { Button } from '../../button'
  import { Chip } from '../../chip'
  import { Collapsible } from '../../collapsible'
  import { IconButton } from '../../icon-button'
  import { Input } from '../../input'
  import { CUGetRegDarkFull as CUGetRegLogo } from '../../logo/cugetreg'
  import { GitHubMark } from '../../logo/vendor'

  export let isLoggedIn: boolean = false
  export let name: string = undefined

  let shortenedName = `${name?.split(' ')[0]} ${name?.split(' ')[1]?.charAt(0)}.`
  let navItems = ['ค้นหาวิชา', 'จัดตารางเรียน', 'เกี่ยวกับ']
  let selected = 'ค้นหาวิชา'
  let collapseItems = ['TEST1', 'TEST2', 'TEST3']
  let openSideBar = false

  const toggleSideBar = () => {
    openSideBar = !openSideBar
  }
</script>

<div
  class=" h-20 py-3 px-5 md:py-3 md:px-10 flex justify-between items-center z-50 border-b-2 border-surface-container-low"
>
  <div class="flex flex-row gap-6 items-center">
    <a href="/">
      <CUGetRegLogo class="w-24 h-8 md:w-32 md:h-10" />
    </a>
    <div class="relative hidden md:flex items-center">
      <Search
        class="absolute right-4 my-auto"
        size="16"
        color="#898EA7"
        strokeWidth="3"
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
          'text-neutral-500 w-28 text-center cursor-pointer hover:text-neutral-800',
          selected === item && 'text-primary',
        )}"
        on:click="{() => (selected = item)}"
        href="/"
      >
        {item}
      </a>
    {/each}
  </div>
  <div class="flex flex-row justify-between items-center gap-2 md:gap-4">
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
      <Collapsible name="{shortenedName}">
        {#each collapseItems as item}
          <p class="p-2 cursor-pointer">{item}</p>
        {/each}
      </Collapsible>
    {:else}
      <!-- To be implemented: add real href in Button -->
      <Button href="login" class="w-24 md:w-28"
        ><p class="text-xs font-light md:text-base">เข้าสู่ระบบ</p></Button
      >
    {/if}
    <IconButton variant="ghost" class="md:hidden" on:click="{toggleSideBar}">
      <Menu size="16" strokeWidth="3" color="#353745" />
    </IconButton>
  </div>

  {#if openSideBar}
    <div
      class="fixed inset-0 bg-[#353745CC]/80 backdrop-blur-[3px] z-10"
      role="button"
      tabindex="0"
      aria-label="Close sidebar"
      on:click="{toggleSideBar}"
      on:keydown="{(e) => e.key === 'Enter' && toggleSideBar()}"
    ></div>
  {/if}
  <div
    class="{cn(
      'fixed top-0 right-0 flex flex-col justify-between h-screen bg-neutral-white z-50 transform transition-transform duration-300 ease-in-out',
      openSideBar ? 'translate-x-0' : 'translate-x-full',
    )}"
    hidden="{!openSideBar}"
  >
    <div class="p-3 flex flex-col gap-5">
      <div class="flex flex-row gap-2">
        <IconButton
          variant="ghost"
          class="md:hidden"
          on:click="{toggleSideBar}"
        >
          <Menu size="16" strokeWidth="3" color="#353745" />
        </IconButton>
        <div class="w-48 flex flex-col gap-2">
          <p class="text-on-surface-placeholder text-[12px]">
            คุณกำลังจัดตารางเรียน...
          </p>
          <p class="text-primary leading-4">ปี 2 ภาคฤดูร้อนที่ยาวมาก บลาบลา</p>
          <Chip class="w-32 flex items-center justify-center"
            >นานาชาติ 66 / ฤดูร้อน</Chip
          >
        </div>
        <IconButton variant="ghost">
          <Settings2 size="16" strokeWidth="2.5" color="#353745" />
        </IconButton>
      </div>
      <div class="relative flex items-center px-3">
        <Search
          class="absolute right-6 my-auto"
          size="16"
          color="#898EA7"
          strokeWidth="3"
        />
        <Input
          placeholder="ค้นหาวิชา"
          class="w-full h-8 bg-surface-container-lowest placeholder:text-neutral-400"
        />
      </div>
      <div class="flex flex-col px-3 gap-3">
        {#each navItems as item}
          <a
            class="{cn(
              'text-neutral-500 cursor-pointer hover:text-neutral-800',
              selected === item && 'text-primary',
            )}"
            on:click="{() => {
              selected = item
              toggleSideBar()
            }}"
            href="/"
          >
            {item}
          </a>
        {/each}
      </div>
    </div>
    {#if isLoggedIn}
      <div
        class="flex flex-row gap-2 p-3 items-center border-t-2 border-surface-container-low"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
          alt="profile pic"
          class="w-10 h-10 rounded-full"
        />
        <div class="flex flex-col">
          <p class="text-on-surface">{name}</p>
          <p class="text-on-surface-placeholder">6XXXXXXXXX</p>
        </div>
      </div>
    {/if}
  </div>
</div>
