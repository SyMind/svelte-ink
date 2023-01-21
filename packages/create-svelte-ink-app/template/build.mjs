import * as esbuild from 'esbuild'
import sveltePlugin from 'esbuild-svelte'

esbuild
    .build({
        entryPoints: ['src/cli.js'],
        bundle: true,
        outfile: 'lib/index.js',
        plugins: [sveltePlugin()],
        platform: 'node'
    })
    .catch(() => process.exit(1))
