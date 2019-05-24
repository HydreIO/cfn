"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.param = param;
exports.default = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _commons = require("@hydre/commons");

var _cfnStackEventStream = _interopRequireDefault(require("cfn-stack-event-stream"));

var _constant = _interopRequireDefault(require("./constant"));

require("colors");

var _class, _temp, _describe, _exist, _describe2, _exist2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

const debug = require('debug')('cfn');

let CFN = (_class = (_temp = class CFN {
  constructor(key, secret, region) {
    Object.defineProperty(this, _exist, {
      value: _exist2
    });
    Object.defineProperty(this, _describe, {
      value: _describe2
    });
    Object.assign(this, {
      key,
      secret,
      region
    });
  }

  async createOrUpdate(name, template, params = [], options = {}) {
    const alreadyExist = await _classPrivateFieldLooseBase(this, _exist)[_exist](name);
    debug((alreadyExist ? 'Updating' : 'Creating') + ` stack [${name}]`);

    try {
      await new Promise((res, rej) => {
        this.api[alreadyExist ? 'updateStack' : 'createStack']({
          StackName: name,
          TemplateBody: JSON.stringify(template),
          Parameters: params,
          ...options
        }, (err, data) => {
          if (err) rej(err);else {
            (0, _cfnStackEventStream.default)(this.api, name).on('data', ({
              Timestamp,
              ResourceType,
              LogicalResourceId,
              ResourceStatus,
              ResourceStatusReason
            }) => {
              debug.extend(LogicalResourceId)(`[${ResourceType}] ${_constant.default[ResourceStatus]} ${ResourceStatusReason ? `(${ResourceStatusReason})` : ''}`);
            }).on('end', async () => {
              debug.extend(name)(`was ${alreadyExist ? 'updated' : 'created'} ${'successfully'.green}`);
              res(data);
            });
          }
        });
      });
    } catch ({
      message
    }) {
      debug.extend('err')(message);
    }
  }

  async delete(StackName) {
    return new Promise((res, rej) => {
      debug(`Deleting stack ${StackName}`);
      this.api.deleteStack({
        StackName
      }, (err, data) => {
        if (err) rej(err);else {
          (0, _cfnStackEventStream.default)(this.api, StackName).on('data', ({
            Timestamp,
            ResourceType,
            LogicalResourceId,
            ResourceStatus,
            ResourceStatusReason = ''
          }) => {
            debug.extend(LogicalResourceId)(`[${ResourceType}] ${_constant.default[ResourceStatus]} ${ResourceStatusReason ? `(${ResourceStatusReason})` : ''}`);
          }).on('end', async () => {
            debug.extend(StackName)(`was deleted ${'successfully'.green}`);
            res(data);
          });
        }
      });
    });
  }

  async validate(template, name = '') {
    const TemplateBody = JSON.stringify(template);
    let check = debug.extend('check');
    if (name) check = check.extend(name);
    check('Validating template');
    return new Promise((res, rej) => {
      this.api.validateTemplate({
        TemplateBody
      }, (err, data) => {
        if (err) {
          check(err.message.red);
          res(false);
        } else {
          check('Template is valid!');
          res(true);
        }
      });
    });
  }

  get api() {
    // const creds = this.key ? { accessKeyId: this.key, secretAccessKey: this.secret } : {}
    // const reg = this.region ? { region: this.region } : {}
    // return new AWS.CloudFormation({
    // 	apiVersion: '2010-05-15',
    // 	...creds,
    // 	...reg
    // })
    return new _awsSdk.default.CloudFormation({
      apiVersion: '2010-05-15',
      accessKeyId: this.key,
      secretAccessKey: this.secret,
      region: this.region
    });
  }

}, _describe = _classPrivateFieldLooseKey("describe"), _exist = _classPrivateFieldLooseKey("exist"), _describe2 = async function _describe2(StackName) {
  return new Promise((res, rej) => {
    this.api.describeStacks({
      StackName
    }, (err, data) => {
      if (err) rej(err);else res(data);
    });
  });
}, _exist2 = async function _exist2(StackName) {
  try {
    await _classPrivateFieldLooseBase(this, _describe)[_describe](StackName);
    return true;
  } catch (error) {
    return false;
  }
}, _temp), (_applyDecoratedDescriptor(_class.prototype, "api", [_commons.cache], Object.getOwnPropertyDescriptor(_class.prototype, "api"), _class.prototype)), _class);
exports.default = CFN;

function param(ParameterKey, ParameterValue) {
  return {
    ParameterKey,
    ParameterValue
  };
}