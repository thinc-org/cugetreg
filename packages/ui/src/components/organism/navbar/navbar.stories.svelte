<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { Navbar } from './index.js'

  const { Story } = defineMeta<typeof Navbar>({
    title: 'Organism/Navbar',
    component: Navbar,
    tags: ['autodocs'],
    argTypes: {
      isLoggedIn: {
        control: 'boolean',
      },
      name: {
        control: 'text',
      },
    },
  })
</script>

<Story
  name="Desktop"
  parameters={{ viewport: { defaultViewport: 'tablet' } }}
/>

<Story
  name="Desktop & Logged In"
  parameters={{ viewport: { defaultViewport: 'tablet' } }}
  args={{
    isLoggedIn: true,
    name: 'Firstname Lastname',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/9700/7ce5/9fb43f41dfa4552821c5c7bc837a7e84?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=UWp0COPKxbiGnZUbN7-EQF0v8PznPXZzvPZxc3mryo-Ht7j~6qUJDaq3uzCuh-z-baS3x6SeJ8omqtDT6ECz6P9KLdXGXtSex5x-2zgezbPQAGBym2aQEuZ4bfn9hCQ6SsImZaG30l5c9Xw1wQxAiuTdPfXP3uPIfZJXesdXB73tKGKNGPv93MDrVpE2ZSaA5hhkkFyhhbqgiRpNEuZ4GMqatcVzjcl5xyhgbRHR2o03eXbvHUsFgzCD-pTFnofOB6pYYzqsroWM3pmCu9NsDXLCDgRNdsGgSczwTwj6vLoWIMuvmEkTcVcHc-0JRGzo4XRpfrJ2X0jd-hTU41H0kQ__',
    id: '6XXXXXXXXX',
  }}
/>

<Story
  name="Mobile"
  parameters={{ viewport: { defaultViewport: 'mobile2' } }}
/>

<Story
  name="Mobile & Loggin In"
  parameters={{ viewport: { defaultViewport: 'mobile2' } }}
  args={{
    isLoggedIn: true,
    name: 'Firstname Lastname',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/9700/7ce5/9fb43f41dfa4552821c5c7bc837a7e84?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=UWp0COPKxbiGnZUbN7-EQF0v8PznPXZzvPZxc3mryo-Ht7j~6qUJDaq3uzCuh-z-baS3x6SeJ8omqtDT6ECz6P9KLdXGXtSex5x-2zgezbPQAGBym2aQEuZ4bfn9hCQ6SsImZaG30l5c9Xw1wQxAiuTdPfXP3uPIfZJXesdXB73tKGKNGPv93MDrVpE2ZSaA5hhkkFyhhbqgiRpNEuZ4GMqatcVzjcl5xyhgbRHR2o03eXbvHUsFgzCD-pTFnofOB6pYYzqsroWM3pmCu9NsDXLCDgRNdsGgSczwTwj6vLoWIMuvmEkTcVcHc-0JRGzo4XRpfrJ2X0jd-hTU41H0kQ__',
    id: '6XXXXXXXXX',
  }}
/>
