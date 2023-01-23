import EventEmitter from 'events'
import sinon from 'sinon'

// Fake process.stdout
interface Stream extends EventEmitter {
	output: string
	columns: number
	write: any
	get(): string | undefined
}

export default (columns?: number): Stream => {
	const stdout = new EventEmitter() as Stream
	stdout.columns = columns ?? 100
	stdout.write = sinon.fake()
	stdout.get = () => {
		return stdout.write.lastCall?.firstArg
	}

	return stdout
}
