import AWS from 'aws-sdk'
import cfnStream from 'cfn-stack-event-stream'
import { cache } from '@hydre/commons'

export default class SDK {
	constructor(key, secret, region) {
		Object.assign(this, { key, secret, region })
	}

	async createStack(options) {
		return this.call('createStack', options)
	}

	async updateStack(options) {
		return this.call('updateStack', options)
	}

	async deleteStack(options) {
		return this.call('deleteStack')
	}

	async validateTemplate(options) {
		return this.call('validateTemplate', options, false)
	}

	async describeStacks(options) {
		return this.call('describeStacks', options, false)
	}

	async call(name, options, stream = true) {
		const data = await new Promise((res, rej) => {
			this.api[name](options, (err, data) => {
				if (err) rej(err)
				else res(data)
			})
		})
		if (stream) return this.#getStream(options)
		else return data
	}

	#getStream({ StackName }) {
		return cfnStream(this.api, StackName)
	}

	@cache // memoize to instanciate the api only once
	get api() {
		return new AWS.CloudFormation({
			apiVersion: '2010-05-15',
			accessKeyId: this.key,
			secretAccessKey: this.secret,
			region: this.region
		})
	}
}
