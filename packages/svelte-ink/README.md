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

This component can display text, and change its style to make it bold, underline, italic or strikethrough.

```svelte
<ink-text color="green">I am green</ink-text>
<ink-text color="black" background-color="white">
    I am black on white
</ink-text>
<ink-text color="#ffffff">I am white</ink-text>
<ink-text bold>I am bold</ink-text>
<ink-text italic>I am italic</ink-text>
<ink-text underline>I am underline</ink-text>
<ink-text strikethrough>I am strikethrough</ink-text>
<ink-text inverse>I am inversed</ink-text>
```

Note: <ink-text> allows only text nodes and nested <ink-text> components inside of it. For example, <ink-box> component can't be used inside <ink-box>.

# License

[MIT](../../LICENSE)
