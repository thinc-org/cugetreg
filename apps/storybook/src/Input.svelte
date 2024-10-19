<script lang="ts">
  import './input.css'

  export let state: 'default' | 'error' | 'success' | 'disable' = 'default'

  export let placeholder: string = 'โปรดกรอกรหัสผ่าน'
  export let label: string = 'รหัสผ่าน'
  export let desc: string = 'กรุณากรอกรหัสผ่านให้ถูกต้อง'
</script>

<div>
  <label>
    {label}
    <input
      type="text"
      class="{['storybook-input', `storybook-input--${state}`].join(' ')}"
      on:click
      {placeholder}
      disabled="{state === 'disable'}"
    />
    <p
      class="{state == 'error'
        ? 'text-error'
        : state == 'success'
          ? 'text-success'
          : ''}"
    >
      {desc}
    </p>
  </label>
</div>
