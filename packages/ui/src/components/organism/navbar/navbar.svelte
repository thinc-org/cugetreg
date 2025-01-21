<script lang="ts">
  import { Menu, Moon, Search, Settings2 } from 'lucide-svelte'

  import { cn, getShortenName } from '@repo/utils'

  import { Button } from '../../atom/button'
  import { Chip } from '../../atom/chip'
  import { Collapsible } from '../../atom/collapsible'
  import { IconButton } from '../../atom/icon-button'
  import { Input } from '../../atom/input'
  import { CUGetRegDarkFull as CUGetRegLogo } from '../../logo/cugetreg'
  import { GitHubMark } from '../../logo/vendor'
  import { UserDialog } from '../../molecule/user-dialog'

  interface Props {
    isLoggedIn?: boolean
    name?: string
    imageUrl?: string
    id?: string
  }

  let {
    isLoggedIn = false,
    name = '',
    imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
    id = '',
  }: Props = $props()

  let shortenedName = $derived(getShortenName(name))
  const navItems = ['ค้นหาวิชา', 'จัดตารางเรียน', 'เกี่ยวกับ']
  let selected = $state('ค้นหาวิชา')
  let openSideBar = $state(false)

  const toggleSideBar = () => {
    openSideBar = !openSideBar
  }
</script>

<div
  class="h-16 md:h-20 px-3 py-1 gap-2 md:py-3 lg:px-10 flex justify-between items-center z-50 border-b-2 border-surface-container-low"
>
  <div class="flex flex-row flex-1 gap-3 items-center lg:gap-6">
    <a href="/">
      <CUGetRegLogo class="w-24 h-8 lg:w-32 lg:h-10" />
    </a>
    <div class="relative hidden md:flex items-center">
      <Search
        class="absolute right-[15%] my-auto lg:right-8"
        size="16"
        color="#898EA7"
        strokeWidth="3"
      />
      <Input
        placeholder="ค้นหาวิชา"
        class="w-11/12 xl:w-full bg-surface-container-lowest placeholder:text-neutral-400"
      />
    </div>
  </div>
  <div
    class="hidden min-[900px]:flex flex-row flex-1 justify-center items-center gap-3 lg:gap-4"
  >
    <!-- To be implemented: add page from navItems-->
    {#each navItems as item}
      <a
        class={cn(
          'text-neutral-500 text-button1 font-medium text-nowrap xl:w-32 text-center cursor-pointer hover:text-neutral-800',
          selected === item && 'text-primary',
        )}
        onclick={() => (selected = item)}
        href="/"
      >
        {item}
      </a>
    {/each}
  </div>
  <div
    class="flex flex-row flex-1 justify-end items-center gap-2 md:gap-3 lg:gap-4"
  >
    <a
      href="https://github.com/thinc-org/cugetreg"
      target="_blank"
      rel="noreferrer"
      class="hidden md:flex"
    >
      <GitHubMark class="w-8 h-8 text-neutral-500 " />
    </a>
    <IconButton color="neutral" class="hidden md:flex">
      <Moon strokeWidth="3" size="16" />
    </IconButton>
    {#if isLoggedIn}
      <Collapsible name={shortenedName}>
        <UserDialog {name} {id} />
      </Collapsible>
    {:else}
      <!-- To be implemented: add real href in Button -->
      <Button href="login" class="w-24 md:w-28">
        <p class="font-medium text-button2">เข้าสู่ระบบ</p>
      </Button>
    {/if}
    <IconButton
      variant="ghost"
      class="min-[900px]:hidden"
      onclick={toggleSideBar}
    >
      <Menu size="16" strokeWidth="3" color="#353745" />
    </IconButton>
  </div>

  {#if openSideBar}
    <div
      class="fixed inset-0 bg-[#353745CC]/80 backdrop-blur-[3px] z-10"
      role="button"
      tabindex="0"
      aria-label="Close sidebar"
      onclick={toggleSideBar}
      onkeydown={(e) => e.key === 'Enter' && toggleSideBar()}
    ></div>
  {/if}
  <div
    class={cn(
      'fixed top-0 right-0 flex flex-col justify-between h-screen bg-surface z-50 transform transition-transform duration-300 ease-in-out',
      openSideBar ? 'translate-x-0' : 'translate-x-full',
    )}
    hidden={!openSideBar}
  >
    <div class="p-3 flex flex-col gap-5">
      <div class="flex flex-row gap-2">
        <IconButton variant="ghost" onclick={toggleSideBar}>
          <Menu size="16" strokeWidth="3" color="#353745" />
        </IconButton>
        <div class="w-48 flex flex-col gap-2">
          <p class="text-on-surface-placeholder text-caption">
            คุณกำลังจัดตารางเรียน...
          </p>
          <p class="text-primary text-subtitle">
            ปี 2 ภาคฤดูร้อนที่ยาวมาก บลาบลา
          </p>
          <Chip class="w-32 flex items-center text-nowrap justify-center">
            นานาชาติ 66 / ฤดูร้อน
          </Chip>
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
            class={cn(
              'text-neutral-500 text-button1 font-medium cursor-pointer hover:text-neutral-800',
              selected === item && 'text-primary',
            )}
            onclick={() => {
              selected = item
              toggleSideBar()
            }}
            href="/"
          >
            {item}
          </a>
        {/each}
      </div>
    </div>
    {#if isLoggedIn}
      <div
        class="flex flex-row gap-4 p-4 items-center border-t-2 border-surface-container-low"
      >
        <img src={imageUrl} alt="profile pic" class="w-10 h-10 rounded-full" />
        <div class="flex flex-col">
          <p class="text-on-surface text-subtitle font-medium">{name}</p>
          <p class="text-on-surface-placeholder text-body2 font-medium">
            {id}
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>
