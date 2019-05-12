![][licence] [![][npm]][npmlink] [![][travis]][travislink]

# @hydre/cfn

[![][discord]][discordlink] [![][twitter]][twitterlink]

[licence]: https://img.shields.io/github/license/HydreIO/cfn.svg?style=for-the-badge
[npm]: https://img.shields.io/npm/v/@hydre/cfn.svg?logo=npm&style=for-the-badge
[npmlink]: https://www.npmjs.com/package/@hydre/cfn
[travis]: https://img.shields.io/travis/com/HydreIO/cfn.svg?logo=travis&style=for-the-badge
[travislink]: https://travis-ci.com/HydreIO/cfn
[twitter]: https://img.shields.io/badge/follow-us-blue.svg?logo=twitter&style=for-the-badge
[twitterlink]: https://twitter.com/hydreio
[discord]: https://img.shields.io/discord/265104803531587584.svg?logo=discord&style=for-the-badge
[discordlink]: https://discord.gg/Ea6a5cn

Create, update, and delete your cloudformation stacks with ease

### Install

`npm i @hydre/cfn`

### Use:

```js
import CFN, { param } from '@hydre/cfn'
```

Create an api instance (you can create as many as you want with different regions or keys)
```js
new CFN(apiKey, secretKey, region)
```

```js
.validate(template)
```

```js
.createOrUpdate(name, template[, options])
// [, option] represent default params from the aws sdk when you either create or update a stack
// if you provide a StackName field in the option param it will override the name param
```

```js
.delete(name)
```

### Exemple:

```js
import CFN, { param } from '@hydre/cfn'

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env
const api = new CFN(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, 'us-west-1')

const template = {
	AWSTemplateFormatVersion: '2010-09-09',
	Description: 'readme',
	Resources: []
}

void (async function() {
	await api.validate(template) // true  | false

	await api.createOrUpdate('my-stack', template, [
		param('key', 'value'),
		param('key', 'value'),
		param('key', 'value'),
		param('key', 'value')
	])

	await api.delete('my-stack')
})()
```
