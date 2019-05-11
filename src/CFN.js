import AWS from 'aws-sdk'
import { cache } from '@hydre/commons'

export default class CFN {

	constructor(key, secret, region) {
		this.key = key
		this.secret = secret
		this.region = region
	}

	async createOrUpdate(name, params, options = {}) {}

	async delete(StackName) {
		return new Promise((res, rej) => {
			this.api.deleteStack({ StackName }, (err, data) => {
				if (err) rej(err)
				res(data)
			})
		})
	}

	async estimateCost(template, params = [], options = {}) {
		return new Promise((res, rej) => {
			this.api.estimateTemplateCost(
				{
					TemplateBody: template,
					Parameters: params
				},
				(err, data) => {
					if (err) rej(err)
					res(data)
				}
			)
		})
	}

	async #describe() {}

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

export function param(key, val) {
	return {
		ParameterKey: key,
		ParameterValue: val
	}
}
