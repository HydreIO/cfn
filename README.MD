<h1 align=center>@hydre/cfn</h1>
<p align=center>
  <img src="https://img.shields.io/github/license/hydreio/cfn.svg?style=for-the-badge" />
  <a href="https://www.npmjs.com/package/@hydre/cfn">
    <img src="https://img.shields.io/npm/v/@hydre/cfn.svg?logo=npm&style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/npm/dw/@hydre/cfn?logo=npm&style=for-the-badge" />
  <img src="https://img.shields.io/github/workflow/status/hydreio/cfn/CI?logo=Github&style=for-the-badge" />
</p>

<h3 align=center>Create, update, and delete your cloudformation stacks with ease</h3>

<p align=center>
	<img src="https://i.imgur.com/WNmQXz7.png" />
</p>

## Install

```
npm i @hydre/cfn
```

## Use:

```js
import { cfn, param } from '@hydre/cfn'
```

> To print logs you'll need to add the DEBUG env variable with `cfn*`

```
DEBUG='cfn*' node my-app.js
```

Create an api instance (you can create as many as you want with different regions or keys)

```js
const api = cfn(apiKey, secretKey, region)

// you can also use AWS_PROFILE env variable or AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY with a custom region
const api = cfn(...[, , region])
const api = cfn()
```

> All functions return a promise

Validate a stack (resolve to true or false)

```js
// the template as a JS object
// the optional name for debug logs purpose
.validate(template[, name])
```

Create or update a stack (resolve to void or throw an err)

```js
// [, option] represent default params from the aws sdk when you either create or update a stack
// if you provide a StackName field in the option param it will override the name param
.createOrUpdate(name, template[, params][, options])
```

Delete a stack (resolve to void or throw an err)

```js
.delete(name)
```

### Exemple:

```js
import { cfn, param } from '@hydre/cfn'

const { AWS_KEY_FOO, AWS_SECRET_FOO } = process.env
const api = new cfn(AWS_KEY_FOO, AWS_SECRET_FOO, 'us-west-1')

const template = {
	AWSTemplateFormatVersion: '2010-09-09',
	Description: 'readme',
	Resources: []
}

void (async function() {
	await api.validate(template)

	await api.createOrUpdate('my-stack', template, [
		param('key', 'value'),
		param('key', 'value'),
		param('key', 'value'),
		param('key', 'value')
	])

	await api.delete('my-stack')
})()
```

### Advanced usage

```js
api.createOrUpdate(...[, , ,], {
	StackName: 'STRING_VALUE' /* required */,
	Capabilities: [
		CAPABILITY_IAM | CAPABILITY_NAMED_IAM | CAPABILITY_AUTO_EXPAND
		/* more items */
	],
	ClientRequestToken: 'STRING_VALUE',
	DisableRollback: true || false,
	EnableTerminationProtection: true || false,
	NotificationARNs: [
		'STRING_VALUE'
		/* more items */
	],
	OnFailure: DO_NOTHING | ROLLBACK | DELETE,
	Parameters: [
		{
			ParameterKey: 'STRING_VALUE',
			ParameterValue: 'STRING_VALUE',
			ResolvedValue: 'STRING_VALUE',
			UsePreviousValue: true || false
		}
		/* more items */
	],
	ResourceTypes: [
		'STRING_VALUE'
		/* more items */
	],
	RoleARN: 'STRING_VALUE',
	RollbackConfiguration: {
		MonitoringTimeInMinutes: 'NUMBER_VALUE',
		RollbackTriggers: [
			{
				Arn: 'STRING_VALUE' /* required */,
				Type: 'STRING_VALUE' /* required */
			}
			/* more items */
		]
	},
	StackPolicyBody: 'STRING_VALUE',
	StackPolicyURL: 'STRING_VALUE',
	Tags: [
		{
			Key: 'STRING_VALUE' /* required */,
			Value: 'STRING_VALUE' /* required */
		}
		/* more items */
	],
	TemplateBody: 'STRING_VALUE',
	TemplateURL: 'STRING_VALUE',
	TimeoutInMinutes: 'NUMBER_VALUE'
})
```
