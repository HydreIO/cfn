import AWS from 'aws-sdk'
import cfnStream from 'cfn-stack-event-stream'

export default class SDK {
  #api

  constructor(
      key, secret, region,
  ) {
    Object.assign(this, {
      key,
      secret,
      region,
    })
  }

  async createStack(options) {
    return this.call('createStack', options)
  }

  async updateStack(options) {
    return this.call('updateStack', options)
  }

  async deleteStack(options) {
    return this.call('deleteStack', options)
  }

  async validateTemplate(options) {
    return this.call(
        'validateTemplate', options, false,
    )
  }

  async describeStacks(options) {
    return this.call(
        'describeStacks', options, false,
    )
  }

  async call(
      name, options, stream = true,
  ) {
    const data = await new Promise((resol, rej) => {
      this.api[name](options, (error, datas) => {
        if (error) rej(error)
        else resol(datas)
      })
    })

    if (stream) return this.getStream(options)
    return data
  }

  getStream({ StackName }) {
    return cfnStream(this.api, StackName)
  }

  get api() {
    if (this.#api) return this.#api
    this.#api = new AWS.CloudFormation({
      apiVersion     : '2010-05-15',
      accessKeyId    : this.key,
      secretAccessKey: this.secret,
      region         : this.region,
    })
    return this.#api
  }
}
