import { SvelteComponent } from 'svelte'
import { SvelteInkDocument, SvelteInkDocumentOptions } from './dom'

export function render(App: typeof SvelteComponent, options: SvelteInkDocumentOptions): SvelteComponent {
    // expose our fake dom as global document for svelte components
    const window = global as any

    window.window = global
    window.document = new SvelteInkDocument(options)

    window.performance = {
        now() {
            return Date.now()
        }
    }

    const root = window.document.createElement('ink-root')
    return new App({
        target: root
    })
}
