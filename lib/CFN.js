"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.param = param;
exports.default = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _commons = require("@hydre/commons");

var _class, _temp, _describe, _describe2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

let CFN = (_class = (_temp = class CFN {
  constructor(key, secret, region) {
    Object.defineProperty(this, _describe, {
      value: _describe2
    });
    this.key = key;
    this.secret = secret;
    this.region = region;
  }

  async createOrUpdate(name, params, options = {}) {}

  async delete(StackName) {
    return new Promise((res, rej) => {
      this.api.deleteStack({
        StackName
      }, (err, data) => {
        if (err) rej(err);
        res(data);
      });
    });
  }

  async estimateCost(template, params = [], options = {}) {
    return new Promise((res, rej) => {
      this.api.estimateTemplateCost({
        TemplateBody: template,
        Parameters: params
      }, (err, data) => {
        if (err) rej(err);
        res(data);
      });
    });
  }

  get api() {
    return new _awsSdk.default.CloudFormation({
      apiVersion: '2010-05-15',
      accessKeyId: this.key,
      secretAccessKey: this.secret,
      region: this.region
    });
  }

}, _describe = _classPrivateFieldLooseKey("describe"), _describe2 = async function _describe2() {}, _temp), (_applyDecoratedDescriptor(_class.prototype, "api", [_commons.cache], Object.getOwnPropertyDescriptor(_class.prototype, "api"), _class.prototype)), _class);
exports.default = CFN;

function param(key, val) {
  return {
    ParameterKey: key,
    ParameterValue: val
  };
}