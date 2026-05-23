<script lang="ts">
  import {
    handleGoogleLogin,
    handleGoogleLogout,
    useSession,
  } from '$lib/auth-client'
  import '$lib/styles/app.css'
  import { page } from '$app/state'
  import { goto } from '$app/navigation'
  import { Navbar } from '@cugetreg/ui/organisms/navbar'
  import toast, { Toaster } from 'svelte-french-toast'

  const session = useSession()

  $effect(() => {
    const errorMsg = page.url.searchParams.get('error')

    if (errorMsg) {
      let message = 'Something went wrong.'
      if (errorMsg === 'non_chula_email') {
        message = 'Please login with Chula email.'
      }

      toast.error(message, {
        position: 'bottom-right',
      })

      const cleanUrl = new URL(page.url)
      cleanUrl.searchParams.delete('error')

      goto(cleanUrl, { replaceState: true, keepFocus: true })
    }
  })

  const { children } = $props()
</script>

<Toaster />
<Navbar
  onLogin={handleGoogleLogin}
  onSignOut={handleGoogleLogout}
  isLoggedIn={Boolean($session.data)}
  name={$session.data?.user.name}
  imageUrl={$session.data?.user.image ??
    'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'}
/>

<!-- TODO: Other page already have navbar which need to be removed -->
<!-- {@render children()} -->
