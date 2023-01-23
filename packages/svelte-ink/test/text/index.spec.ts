import path from 'path'
import url from 'url'
import test from 'ava'
import chalk from 'chalk'
import { renderToString as originRenderToString } from '../helpers/render-to-string'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

function renderToString(id: string): Promise<string> {
	const modulePath = path.join(__dirname, id)
	return originRenderToString(modulePath)
}

test('<ink-text> with undefined children', async t => {
	const output = await renderToString('with undefined children.svelte')
	t.is(output, '')
})

test('<ink-text> with standard color', async t => {
	const output = await renderToString('with standard color.svelte')
	t.is(output, chalk.green('Test'))
})

test('<ink-text> with dimmed color', async t => {
	const output = await renderToString('with dimmed color.svelte')
	t.is(output, chalk.green.dim('Test'))
})

test('<ink-text> with hex color', async t => {
	const output = await renderToString('with hex color.svelte')
	t.is(output, chalk.hex('#FF8800')('Test'))
})

test('<ink-text> with rgb color', async t => {
	const output = await renderToString('with rgb color.svelte')
	t.is(output, chalk.rgb(255, 136, 0)('Test'))
})

test('<ink-text> with ansi256 color', async t => {
	const output = await renderToString('with ansi256 color.svelte')
	t.is(output, chalk.ansi256(194)('Test'))
})

test('<ink-text> with standard background color', async t => {
	const output = await renderToString('with standard background color.svelte')
	t.is(output, chalk.bgGreen('Test'))
})

test('<ink-text> with hex background color', async t => {
	const output = await renderToString('with hex background color.svelte')
	t.is(output, chalk.bgHex('#FF8800')('Test'))
})

test('<ink-text> with rgb background color', async t => {
	const output = await renderToString('with rgb background color.svelte')
	t.is(output, chalk.bgRgb(255, 136, 0)('Test'))
})

test('<ink-text> with ansi256 background color', async t => {
	const output = await renderToString('with ansi256 background color.svelte')
	t.is(output, chalk.bgAnsi256(194)('Test'))
})

test('<ink-text> with inversion', async t => {
	const output = await renderToString('with inversion.svelte')
	t.is(output, chalk.inverse('Test'))
})

// test('remeasure text when text is changed', t => {
// 	const Test = ({add}) => (
// 		<Box>
// 			<Text>{add ? 'abcx' : 'abc'}</Text>
// 		</Box>
// 	)

// 	const stdout = createStdout()
// 	const {rerender} = render(<Test />, {stdout, debug: true})
// 	t.is(stdout.write.lastCall.args[0], 'abc')

// 	rerender(<Test add />)
// 	t.is(stdout.write.lastCall.args[0], 'abcx')
// })

// test('remeasure text when text nodes are changed', t => {
// 	const Test = ({add}) => (
// 		<Box>
// 			<Text>
// 				abc
// 				{add && <Text>x</Text>}
// 			</Text>
// 		</Box>
// 	)

// 	const stdout = createStdout()
// 	const {rerender} = render(<Test />, {stdout, debug: true})
// 	t.is(stdout.write.lastCall.args[0], 'abc')

// 	rerender(<Test add />)
// 	t.is(stdout.write.lastCall.args[0], 'abcx')
// })
