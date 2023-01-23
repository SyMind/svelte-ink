import ansiEscapes from 'ansi-escapes'
import chalk from 'chalk'

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
        const text = writes.join('')

        const color = this.getAttribute('color')
        if (typeof color === 'string') {
            return chalk[color](text)
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
