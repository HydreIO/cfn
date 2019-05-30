import Sdk from './infra/aws'
import Cfn from './domain/CFN'

export function param(ParameterKey, ParameterValue) {
	return { ParameterKey, ParameterValue }
}

export function cfn(key, secret, region) {
	return new Sdk(key, secret, region) |> new Cfn(#)
}