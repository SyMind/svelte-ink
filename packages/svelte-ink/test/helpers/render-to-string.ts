import importSvelte from 'import-svelte'
import {render} from '../../src'
import createStdout from './create-stdout'

export function renderToString(id: string, options: {columns: number} = {columns: 100}): string | undefined {
    const App = importSvelte(id)
	const stdout = createStdout(options.columns)

	render(App, {
		// @ts-ignore
		stdout,
		debug: true
	})

	return stdout.get()
}
