<script>
    import { onDestroy } from 'svelte'

    let counter = 0

    const timer = setInterval(() => {
        counter += 1
    }, 100)

    onDestroy(() => clearInterval(timer))
</script>

<ink-text color="green">{counter} tests passed</ink-text>
