import Sdk from './infra/aws'
import Cfn from './domain/cfn.js'

// eslint-disable-next-line unicorn/prevent-abbreviations
export const param = (ParameterKey, ParameterValue) => ({
  ParameterKey,
  ParameterValue,
})

export const cfn = (
    key, secret, region,
) =>
  new Cfn(new Sdk(
      key, secret, region,
  ))
