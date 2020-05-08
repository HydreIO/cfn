/* eslint-disable max-len */
import states from '../constant.js'
import 'colors'
import commons from '@hydre/commons'
import log from 'debug'

const debug = log('cfn')
const { Deferred } = commons

export default class CFN {
  #sdk

  constructor(sdk) {
    this.#sdk = sdk
  }

  // eslint-disable-next-line max-params
  async createOrUpdate(
      name, template, parameters = [], options = {},
  ) {
    if (!name) throw new Error('Stack name missing')

    const alreadyExist = await this.exist(name)

    debug((alreadyExist ? 'Updating' : 'Creating') + ` stack [${ name }]`)
    try {
      const stream = await this.#sdk[
        alreadyExist ? 'updateStack' : 'createStack'
      ]({
        StackName   : name,
        TemplateBody: JSON.stringify(template),
        Parameters  : parameters,
        ...options,
      })

      stream.on('data', datas => {
        const {
          ResourceType,
          LogicalResourceId,
          ResourceStatus,
          ResourceStatusReason,
        } = datas

        debug.extend(LogicalResourceId)(`[${ ResourceType }] ${ states[ResourceStatus] } ${
            ResourceStatusReason ? `(${ ResourceStatusReason })` : ''
        }`)
      })

      const def = new Deferred()

      stream.on('end', () => {
        debug.extend(name)(`was ${ alreadyExist ? 'updated' : 'created' } ${ 'successfully'.green }`)
        def.resolve()
      })
      await def.promise
    } catch ({ message }) {
      debug.extend('err')(message)
    }
  }

  async delete(StackName) {
    debug(`Deleting stack ${ StackName }`)

    const stream = await this.#sdk.deleteStack({ StackName })

    stream.on('data', datas => {
      const {
        ResourceType,
        LogicalResourceId,
        ResourceStatus,
        ResourceStatusReason,
      } = datas

      debug.extend(LogicalResourceId)(`[${ ResourceType }] ${ states[ResourceStatus] } ${
          ResourceStatusReason ? `(${ ResourceStatusReason })` : ''
      }`)
    })

    const def = new Deferred()

    stream.on('end', () => {
      debug.extend(StackName)(`was deleted ${ 'successfully'.green }`)
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
    } catch (error) {
      check(error.message.red)
      return false
    }
  }

  async describe(StackName) {
    return this.#sdk.describeStacks({ StackName })
  }

  async exist(StackName) {
    try {
      await this.describe(StackName)
      return true
    } catch (error) {
      return false
    }
  }
}
