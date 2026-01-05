<script lang="ts">
  import { Router, Route, Link } from 'svelte-routing'

  import Home from './pages/Home.svelte'
  import About from './pages/About.svelte'
  import NotFound from './pages/NotFound.svelte'
</script>

<Router>
  <main>
    <Route path="/">
      <Home />
    </Route>
    <Route path="/about">
      <About />
    </Route>
    <Route path="*">
      <NotFound />
    </Route>
  </main>
</Router>
