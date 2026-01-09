import { mount } from 'svelte'
import './app.css'
import Schedule from "./pages/schedule.svelte";

const app = mount(Schedule, {
    target: document.getElementById('app')!,
})

export default app
