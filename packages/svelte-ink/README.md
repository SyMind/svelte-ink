<h1 align="center">Svelte Ink</h1>

<p align="center">Svelte for CLIs. Build and test your CLI output using components.</p>

# Install

```bash
npm install svelte-ink
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

# License

[MIT](../../LICENSE)
