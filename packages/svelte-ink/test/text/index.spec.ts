import path from 'path'
import url from 'url'
import test from 'ava'
import { renderToString } from '../helpers/render-to-string'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

function wait() {
	return new Promise(resolve => {
		setTimeout(resolve, 1000)
	})
}

test('<ink-text> with undefined children', async t => {
	const modulePath = path.join(__dirname, 'with undefined children.svelte')
	const output = renderToString(modulePath)
	await wait()
	t.is(output, undefined)
})
