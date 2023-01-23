<h1 align="center">Svelte Ink</h1>

<p align="center">Svelte for CLIs. Build and test your CLI output using components.</p>

# Install

Use create-svelte-ink-app to quickly scaffold a new Ink-based CLI.

```bash
npx create-svelte-ink-app
```

# Usage

```svelte
<script>
import { onDestroy } from 'svelte'

let counter = 0

const timer = setInterval(() => {
    counter += 1
}, 100)

onDestroy(() => clearInterval(timer))
</script>

<ink-text color="green">{counter} tests passed</ink-text>
```

<img src="media/demo.svg" width="600">

# Components

## `<ink-text>`

# License

[MIT](../../LICENSE)
