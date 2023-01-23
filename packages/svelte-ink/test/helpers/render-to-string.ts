import importSvelte from 'import-svelte'
import {render} from '../../src'
import createStdout from './create-stdout'

function wait(): Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve)
	})
}

export async function renderToString(id: string, options: {columns: number} = {columns: 100}): Promise<string> {
    const App = importSvelte(id, {
		hydratable: true
	})
	const stdout = createStdout(options.columns)

	render(App, {
		// @ts-ignore
		stdout
	})

	await wait()

	return stdout.get()
}
