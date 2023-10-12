import {environmentBase} from './environment.base'

export const environment = {
  ... environmentBase,
  collectionNameSuffix: '' /* NOTE: never put debug suffix here, coz wanna deploy to vercel to use it */,
  production: true
};
