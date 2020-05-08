import '@hydre/doubt'
import Sdk from './aws.mock.js'
import Cfn from '../src/domain/cfn.js'

'Cfn:createOrUpdate'.doubt(async () => {
  const sdk = new Sdk()
  const cfn = new Cfn(sdk)
  const name = 'test'

  try {
    await cfn.createOrUpdate()
    throw 'created'
  } catch (error) {
    'createOrUpdate'
        .should('throw an error when the name argument is missing')
        .because(error?.message)
        .is('Stack name missing')
  }

  await cfn.createOrUpdate(name, {})
  'createOrUpdate'
      .should('create a stack when it doesn\'t exist')
      .because(sdk.stacks.get(name)?.updateCount)
      .is(0)

  await cfn.createOrUpdate(name, {})
  'createOrUpdate'
      .should('update a stack when it already exist')
      .because(sdk.stacks.get(name)?.updateCount)
      .is(1)
})

'Cfn:delete'.doubt(async () => {
  const sdk = new Sdk()
  const cfn = new Cfn(sdk)
  const name = 'test'

  try {
    await cfn.delete(name)
    throw 'succeed'
  } catch (error) {
    'delete'
        .should('throw an error when the stack doesn\'t exist')
        .because(error?.message)
        .is('Stack doesn\'t exist')
  }

  await cfn.createOrUpdate(name, {})
  await cfn.delete(name)
  'delete'
      .should('delete a stack')
      .because(sdk.stacks.get(name))
      .is(undefined)
})

'Cfn:validate'.doubt(async () => {
  const sdk = new Sdk()
  const cfn = new Cfn(sdk)
  const valid = await cfn.validate({})

  'validate'
      .should('resolve to true when the template is valid')
      .because(valid)
      .is(true)

  sdk.validate = () => {
    throw new Error('invalid')
  }

  const invalid = await cfn.validate({})

  'validate'
      .should('resolve to false when the template is not valid')
      .because(invalid)
      .is(false)
})
