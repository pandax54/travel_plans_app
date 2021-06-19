/// <reference types="chai" />

import Assertion = Chai.Assertion

declare namespace Chai {
  export interface Assertion {
    (message?: string): Assertion;
  }
}

declare module "dirty-chai" {
  function dirtyChai(chai: any, utils: any): void
  namespace dirtyChai {  }
  export = dirtyChai
}
