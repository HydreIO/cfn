import '@hydre/doubt'
import Sdk from './aws.mock'
import Cfn from '../src/domain/CFN'

'Cfn:createOrUpdate'.doubt(async () => {
	const sdk = new Sdk()
	const cfn = new Cfn(sdk)
	const name = 'test'

	await 'should throw an error if the name argument is missing'.because(cfn.createOrUpdate).fails()

	await cfn.createOrUpdate(name, {})
	"should create a stack when it doesn't exist"
		.because(sdk.stacks.get(name)?.updateCount)
		.isEqualTo(0)

	await cfn.createOrUpdate(name, {})
	'should update a stack when it alreadi exist'
		.because(sdk.stacks.get(name)?.updateCount)
		.isEqualTo(1)
})

'Cfn:delete'.doubt(async () => {
	const sdk = new Sdk()
	const cfn = new Cfn(sdk)
	const name = 'test'

	"should throw an error when the stack doesn't exist".because(async () => cfn.delete(name)).fails()
	await cfn.createOrUpdate(name, {})
	await cfn.delete(name)
	'should delete a stack'.because(sdk.stacks.get(name)).isUndefined()
})

'Cfn:validate'.doubt(async () => {
	const sdk = new Sdk()
	const cfn = new Cfn(sdk)
	const name = 'test'

	const valid = await cfn.validate({})
	'should resolve to t
	rue when the template is valid'.because(valid).isTrue()

	sdk.validate = () => throw new Error('invalid')
	const valid2 = await cfn.validate({})
	'should resolve to false when the template is not valid'.because(valid2).isFalse()
})
