<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { UserDialog } from './index'

  const { Story } = defineMeta<typeof UserDialog>({
    title: 'Molecule/User Dialog',
    component: UserDialog,
    tags: ['autodocs'],
    argTypes: {
      imageUrl: {
        control: 'text',
      },
      name: {
        control: 'text',
      },
      id: {
        control: 'text',
      },
    },
  })
</script>

<Story
  name="Example"
  args={{
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/9700/7ce5/9fb43f41dfa4552821c5c7bc837a7e84?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=UWp0COPKxbiGnZUbN7-EQF0v8PznPXZzvPZxc3mryo-Ht7j~6qUJDaq3uzCuh-z-baS3x6SeJ8omqtDT6ECz6P9KLdXGXtSex5x-2zgezbPQAGBym2aQEuZ4bfn9hCQ6SsImZaG30l5c9Xw1wQxAiuTdPfXP3uPIfZJXesdXB73tKGKNGPv93MDrVpE2ZSaA5hhkkFyhhbqgiRpNEuZ4GMqatcVzjcl5xyhgbRHR2o03eXbvHUsFgzCD-pTFnofOB6pYYzqsroWM3pmCu9NsDXLCDgRNdsGgSczwTwj6vLoWIMuvmEkTcVcHc-0JRGzo4XRpfrJ2X0jd-hTU41H0kQ__',
    name: 'Wanrudee Kkk',
    id: '6XXXXXXXXX',
  }}
/>
