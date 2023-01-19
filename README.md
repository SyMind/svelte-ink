# Svelte Ink

Svelte for CLIs. Build and test your CLI output using components.

# Install

```bash
npm install ink react
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

# LICENSE

[MIT](./LICENSE)
