import ansiEscapes from 'ansi-escapes'
import chalk from 'chalk'
import { colorize } from './colorize'

export type InkNodeAttribute = boolean | string | number

let timer: ReturnType<typeof setTimeout> = null

export abstract class InkNode {
    public parentNode: InkNode | null = null

    public abstract nodeName: string

    public childNodes: InkNode[] = []

    private attributes: Record<string, InkNodeAttribute> = {}
    
    private stdout: NodeJS.WriteStream

    constructor(stdout: NodeJS.WriteStream) {
        this.stdout = stdout
    }

    public getAttribute(key: string): InkNodeAttribute {
        return this.attributes[key]
    }

    public setAttribute(key: string, value?: InkNodeAttribute): void {
        if (value == null) {
            delete this.attributes[key]
        } else {
            this.attributes[key] = value
        }

        this.bubbling()
    }

    public appendChild(child: InkNode): void {
        this.childNodes.push(child)
        child.parentNode = this

        this.bubbling()
    }

    public removeChild(child: InkNode): void {
        const index = this.childNodes.indexOf(child)
        if (index >= 0) {
            this.childNodes.splice(index, 1)
        }

        this.bubbling()
    }

    public insertBefore(node: InkNode, child: InkNode): void {
        if (node.parentNode) {
            node.parentNode.removeChild(node)
        }
    
        node.parentNode = this
    
        const index = node.childNodes.indexOf(child)
        if (index >= 0) {
            this.childNodes.splice(index, 0, node)
            return
        }
    
        this.childNodes.push(node)

        this.bubbling()
    }

    public bubbling(): void {
        if (this.parentNode) {
            this.parentNode.bubbling()
        } else if (this.nodeName === 'ink-root') {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                this.stdout.write(ansiEscapes.eraseLines(1))
                this.stdout.write(this.render())
            })
        }
    }

    public abstract render(): string
}

class TextNode extends InkNode {
    nodeName = 'text'

    private _data: string

    constructor(data: string, stdout: NodeJS.WriteStream) {
        super(stdout)
        this._data = String(data)
    }

    get wholeText(): string {
        return this._data
    }

    set data(data: string) {
        this._data = data

        this.bubbling()
    }

    get data(): string {
        return this._data
    }

    render(): string {
        return this._data
    }
}

class InkViewNode extends InkNode {
    public nodeName: string

    constructor(nodeName: string, stdout: NodeJS.WriteStream) {
        super(stdout)
        this.nodeName = nodeName
    }

    render() {
        const writes: string[] = []
        for (const child of this.childNodes) {
            writes.push(child.render())
        }
        let text = writes.join('')

        const dimColor = this.getAttribute('dim-color')
        if (typeof dimColor === 'string') {
            text = chalk.dim(text)
        }

        const color = this.getAttribute('color')
        if (typeof color === 'string') {
            text = colorize(text, color, 'foreground')
        }

        const backgroundColor = this.getAttribute('background-color')
        if (typeof backgroundColor === 'string') {
            text = colorize(text, backgroundColor, 'background')
        }

        const bold = this.getAttribute('bold')
        if (typeof bold === 'string') {
			text = chalk.bold(text)
		}

        const italic = this.getAttribute('italic')
		if (typeof italic === 'string') {
			text = chalk.italic(text)
		}

        const underline = this.getAttribute('underline')
		if (typeof underline === 'string') {
			text = chalk.underline(text)
		}

        const strikethrough = this.getAttribute('strikethrough')
		if (typeof strikethrough === 'string') {
			text = chalk.strikethrough(text)
		}

        const inverse = this.getAttribute('inverse')
		if (typeof inverse === 'string') {
			text = chalk.inverse(text)
		}

        return text
    }
}

export interface SvelteInkDocumentOptions {
    /**
	 * Output stream where app will be rendered.
	 *
	 * @default process.stdout
	 */
	stdout?: NodeJS.WriteStream;
}

export class SvelteInkDocument {
    private stdout: NodeJS.WriteStream

    constructor(options: SvelteInkDocumentOptions = {}) {
        this.stdout = options.stdout || process.stdout
    }

	createElement(nodeName: string): InkNode {
        return new InkViewNode(nodeName, this.stdout)
	}

	createTextNode(data: string): TextNode {
		return new TextNode(data, this.stdout)
	}
}
