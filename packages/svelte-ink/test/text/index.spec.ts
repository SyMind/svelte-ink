import path from 'path'
import url from 'url'
import test from 'ava'
import chalk from 'chalk'
import { renderToString as originRenderToString } from '../helpers/render-to-string'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

function renderToString(id: string): Promise<string | undefined> {
	const modulePath = path.join(__dirname, id)
	return originRenderToString(modulePath)
}

test('<ink-text> with undefined children', async t => {
	const output = await renderToString('with undefined children.svelte')
	t.is(output, undefined)
})

test('<ink-text> with null children', async t => {
	const output = await renderToString('with null children.svelte')
	t.is(output, undefined)
})

test('<ink-text> with standard color', async t => {
	const output = await renderToString('with standard color.svelte')
	t.is(output, chalk.green('Test'))
})

test('<ink-text> with dimmed color', async t => {
	const output = await renderToString('with dimmed color.svelte')
	t.is(output, chalk.green.dim('Test'))
})
