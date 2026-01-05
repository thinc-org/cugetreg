<script lang="ts">
  import { Menu, Moon, Search, Settings2 } from 'lucide-svelte'

  import { cn, getShortenName } from '../../../../utils'

  import { Button } from '../../atoms/button'
  import { Chip } from '../../atoms/chip'
  import { Collapsible } from '../../atoms/collapsible'
  import { IconButton } from '../../atoms/icon-button'
  import { Input } from '../../atoms/input'
  import { CUGetRegDarkFull as CUGetRegLogo } from '../../logo/cugetreg'
  import { GitHubMark } from '../../logo/vendor'
  import { UserDialog } from '../../molecules/user-dialog'

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
  type NavItem = {
    label: string
    href: string
  }

  const navItems: NavItem[] = [
    { label: 'ค้นหาวิชา', href: '/search' },
    { label: 'จัดตารางเรียน', href: '/schedule' },
    { label: 'เกี่ยวกับ', href: '/about' },
  ]

  let selected = $state('ค้นหาวิชา')
  let openSideBar = $state(false)

  const toggleSideBar = () => {
    openSideBar = !openSideBar
  }
</script>

<div
  class="border-surface-container-low z-50 flex h-16 items-center justify-between gap-2 border-b-2 px-3 py-1 md:h-20 md:py-3 lg:px-10"
>
  <div class="flex flex-1 flex-row items-center gap-3 lg:gap-6">
    <a href="/">
      <CUGetRegLogo class="h-8 w-24 lg:h-10 lg:w-32" />
    </a>
    <div class="relative hidden items-center md:flex">
      <Search
        class="absolute right-[15%] my-auto lg:right-8"
        size="16"
        color="#898EA7"
        strokeWidth="3"
      />
      <Input
        placeholder="ค้นหาวิชา"
        class="bg-surface-container-lowest w-11/12 placeholder:text-neutral-400 xl:w-full"
      />
    </div>
  </div>
  <div
    class="hidden flex-1 flex-row items-center justify-center gap-3 min-[900px]:flex lg:gap-4"
  >
    {#each navItems as item}
      <a
        href={item.href}
        class={cn(
          'text-button1 cursor-pointer text-center font-medium text-nowrap text-neutral-500 hover:text-neutral-800 xl:w-32',
          selected === item.href && 'text-primary',
        )}
        onclick={() => (selected = item.href)}
      >
        {item.label}
      </a>
    {/each}
  </div>
  <div
    class="flex flex-1 flex-row items-center justify-end gap-2 md:gap-3 lg:gap-4"
  >
    <a
      href="https://github.com/thinc-org/cugetreg"
      target="_blank"
      rel="noreferrer"
      class="hidden md:flex"
    >
      <GitHubMark class="h-8 w-8 text-neutral-500 " />
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
        <p class="text-button2 font-medium">เข้าสู่ระบบ</p>
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
      class="fixed inset-0 z-10 bg-[#353745CC]/80 backdrop-blur-[3px]"
      role="button"
      tabindex="0"
      aria-label="Close sidebar"
      onclick={toggleSideBar}
      onkeydown={(e) => e.key === 'Enter' && toggleSideBar()}
    ></div>
  {/if}
  <div
    class={cn(
      'bg-surface fixed top-0 right-0 z-50 flex h-screen transform flex-col justify-between transition-transform duration-300 ease-in-out',
      openSideBar ? 'translate-x-0' : 'translate-x-full',
    )}
    hidden={!openSideBar}
  >
    <div class="flex flex-col gap-5 p-3">
      <div class="flex flex-row gap-2">
        <IconButton variant="ghost" onclick={toggleSideBar}>
          <Menu size="16" strokeWidth="3" color="#353745" />
        </IconButton>
        <div class="flex w-48 flex-col gap-2">
          <p class="text-on-surface-placeholder text-caption">
            คุณกำลังจัดตารางเรียน...
          </p>
          <p class="text-primary text-subtitle">
            ปี 2 ภาคฤดูร้อนที่ยาวมาก บลาบลา
          </p>
          <Chip class="flex w-32 items-center justify-center text-nowrap">
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
          class="bg-surface-container-lowest h-8 w-full placeholder:text-neutral-400"
        />
      </div>
      <div class="flex flex-col gap-3 px-3">
        {#each navItems as item}
          <a
            href={item.href}
            class={cn(
              'text-button1 cursor-pointer font-medium text-neutral-500 hover:text-neutral-800',
              selected === item.href && 'text-primary',
            )}
            onclick={() => {
              selected = item.href
              toggleSideBar()
            }}
          >
            {item.label}
          </a>
        {/each}
      </div>
    </div>
    {#if isLoggedIn}
      <div
        class="border-surface-container-low flex flex-row items-center gap-4 border-t-2 p-4"
      >
        <img src={imageUrl} alt="profile pic" class="h-10 w-10 rounded-full" />
        <div class="flex flex-col">
          <p class="text-on-surface text-subtitle font-medium">
            {name}
          </p>
          <p class="text-on-surface-placeholder text-body2 font-medium">
            {id}
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>
