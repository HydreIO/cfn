import states from '../constant'
import 'colors'
import { Deferred } from '@hydre/commons'
const debug = require('debug')('cfn')

export default class CFN {
	#sdk

	constructor(sdk) {
		this.#sdk = sdk
	}

	async createOrUpdate(name, template, params = [], options = {}) {
		const alreadyExist = await this.#exist(name)
		debug((alreadyExist ? 'Updating' : 'Creating') + ` stack [${name}]`)
		try {
			const stream = await this.#sdk[alreadyExist ? 'updateStack' : 'createStack']({
				StackName: name,
				TemplateBody: JSON.stringify(template),
				Parameters: params,
				...options
			})

			stream.on('data', datas => {
				const {
					Timestamp,
					ResourceType,
					LogicalResourceId,
					ResourceStatus,
					ResourceStatusReason
				} = datas

				debug.extend(LogicalResourceId)(
					`[${ResourceType}] ${states[ResourceStatus]} ${
						ResourceStatusReason ? `(${ResourceStatusReason})` : ''
					}`
				)
			})

			const def = new Deferred()
			stream.on('end', () => {
				debug.extend(name)(`was ${alreadyExist ? 'updated' : 'created'} ${'successfully'.green}`)
				def.resolve()
			})
			await def.promise
		} catch ({ message }) {
			debug.extend('err')(message)
		}
	}

	async delete(StackName) {
		debug(`Deleting stack ${StackName}`)
		const stream = await this.#sdk.deleteStack({ StackName })

		stream.on('data', datas => {
			const {
				Timestamp,
				ResourceType,
				LogicalResourceId,
				ResourceStatus,
				ResourceStatusReason
			} = datas
			debug.extend(LogicalResourceId)(
				`[${ResourceType}] ${states[ResourceStatus]} ${
					ResourceStatusReason ? `(${ResourceStatusReason})` : ''
				}`
			)
		})

		const def = new Deferred()
		stream.on('end', () => {
			debug.extend(StackName)(`was deleted ${'successfully'.green}`)
			def.resolve()
		})
		await def.promise
	}

	async validate(template, name = '') {
		const TemplateBody = JSON.stringify(template)
		let check = debug.extend('check')
		if (name) check = check.extend(name)
		check('Validating template')

		try {
			await this.#sdk.validateTemplate({ TemplateBody })
			check('Template is valid!')
			return true
		} catch (err) {
			check(err.message.red)
			return false
		}
	}

	async #describe(StackName) {
		return await this.#sdk.describeStacks({ StackName })
	}

	async #exist(StackName) {
		try {
			await this.#describe(StackName)
			return true
		} catch (error) {
			return false
		}
	}
}