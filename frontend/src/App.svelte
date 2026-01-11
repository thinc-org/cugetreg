<script lang="ts">
  import { Router, Route, Link } from 'svelte-routing'
  
  import Home from './pages/Home.svelte'
  import About from './pages/About.svelte'
  import Error from './pages/Error.svelte'
  import "./app.css"; 
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
      <Error />
    </Route>
  </main>
</Router>