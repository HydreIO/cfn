import AWS from 'aws-sdk'
import { cache } from '@hydre/commons'
import cfnStream from 'cfn-stack-event-stream'
import states from './constant'
import 'colors'
const debug = require('debug')('cfn')

export default class CFN {
	constructor(key, secret, region) {
		Object.assign(this, { key, secret, region })
	}

	async createOrUpdate(name, template, params = [], options = {}) {
		const alreadyExist = await this.#exist(name)
		debug((alreadyExist ? 'Updating' : 'Creating') + ` stack [${name}]`)
		try {
			await new Promise((res, rej) => {
				this.api[alreadyExist ? 'updateStack' : 'createStack'](
					{
						StackName: name,
						TemplateBody: JSON.stringify(template),
						Parameters: params,
						...options
					},
					(err, data) => {
						if (err) rej(err)
						else {
							cfnStream(this.api, name)
								.on(
									'data',
									({
										Timestamp,
										ResourceType,
										LogicalResourceId,
										ResourceStatus,
										ResourceStatusReason
									}) => {
										debug.extend(LogicalResourceId)(
											`[${ResourceType}] ${states[ResourceStatus]} ${
												ResourceStatusReason ? `(${ResourceStatusReason})` : ''
											}`
										)
									}
								)
								.on('end', async () => {
									debug.extend(name)(
										`was ${alreadyExist ? 'updated' : 'created'} ${'successfully'.green}`
									)
									res(data)
								})
						}
					}
				)
			})
		} catch ({ message }) {
			debug.extend('err')(message)
		}
	}

	async delete(StackName) {
		return new Promise((res, rej) => {
			debug(`Deleting stack ${StackName}`)
			this.api.deleteStack({ StackName }, (err, data) => {
				if (err) rej(err)
				else {
					cfnStream(this.api, StackName)
						.on(
							'data',
							({
								Timestamp,
								ResourceType,
								LogicalResourceId,
								ResourceStatus,
								ResourceStatusReason = ''
							}) => {
								debug.extend(LogicalResourceId)(
									`[${ResourceType}] ${states[ResourceStatus]} ${
										ResourceStatusReason ? `(${ResourceStatusReason})` : ''
									}`
								)
							}
						)
						.on('end', async () => {
							debug.extend(StackName)(`was deleted ${'successfully'.green}`)
							res(data)
						})
				}
			})
		})
	}

	async validate(template, name = '') {
		const TemplateBody = JSON.stringify(template)
		let check = debug.extend('check')
		if (name) check = check.extend(name)
		check('Validating template')
		return new Promise((res, rej) => {
			this.api.validateTemplate({ TemplateBody }, (err, data) => {
				if (err) {
					check(err.message.red)
					res(false)
				} else {
					check('Template is valid!')
					res(true)
				}
			})
		})
	}

	async #describe(StackName) {
		return new Promise((res, rej) => {
			this.api.describeStacks({ StackName }, (err, data) => {
				if (err) rej(err)
				else res(data)
			})
		})
	}

	async #exist(StackName) {
		try {
			await this.#describe(StackName)
			return true
		} catch (error) {
			return false
		}
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

export function param(ParameterKey, ParameterValue) {
	return { ParameterKey, ParameterValue }
}
