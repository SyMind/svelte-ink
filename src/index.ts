import { SvelteComponent } from 'svelte'
import { SvelteInkDocument } from './dom'

// expose our fake dom as global document for svelte components
let window = global as any

window.window = global
window.document = new SvelteInkDocument()

window.performance = {
    now() {
        return Date.now()
    }
}

export function render(App: typeof SvelteComponent): SvelteComponent {
    const root = window.document.createElement('ink-root')
    return new App({
        target: root
    })
}
