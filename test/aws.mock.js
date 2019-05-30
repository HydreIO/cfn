import { cache } from '@hydre/commons'

export default class {
	stacks = new Map()
	validate = () => true

	async createStack({ StackName }) {
		if (this.stacks.has(StackName)) throw new Error('Stack already exist')
		this.stacks.set(StackName, {
			updateCount: 0
		})
		return new Stream(StackName)
	}

	async updateStack({ StackName }) {
		if (!this.stacks.has(StackName)) throw new Error("Stack doesn't exist")
		this.stacks.get(StackName).updateCount++
		return new Stream(StackName)
	}

	async deleteStack({ StackName }) {
		if (!this.stacks.has(StackName)) throw new Error("Stack doesn't exist")
		this.stacks.delete(StackName)
		return new Stream(StackName)
	}

	async validateTemplate() {
		return this.validate()
	}

	async describeStacks({ StackName }) {
		return this.stacks.get(StackName) || throw new Error("Stack doesn't exist")
	}
}

class Stream {
	constructor(name) {
		this.StackName = name
	}

	StackId = 'stackId'
	EventId = 'eventId'
	LogicalResourceId = 'logicalId'
	PhysicalResourceId = 'physicalId'
	ResourceType = 'type'
	Timestamp = new Date()
	ResourceStatus = 'CREATE_IN_PROGRESS'
	ResourceStatusReason = 'statusReason'
	ResourceProperties = 'properties'
	ClientRequestToken = 'requestToken'

	on(name, consumer) {
		switch (name) {
			case 'data':
				consumer({
					StackId: this.StackId,
					EventId: this.EventId,
					StackName: this.StackName,
					LogicalResourceId: this.LogicalResourceId,
					PhysicalResourceId: this.PhysicalResourceId,
					ResourceType: this.ResourceType,
					Timestamp: this.Timestamp,
					ResourceStatus: this.ResourceStatus,
					ResourceStatusReason: this.ResourceStatusReason,
					ResourceProperties: this.ResourceProperties,
					ClientRequestToken: this.ClientRequestToken
				})
				break
			case 'end':
				consumer()
				break
			default:
				throw new Error(`stream.on(${name}) is not defined`)
		}
	}
}
