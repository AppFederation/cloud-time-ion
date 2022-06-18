import {RequestLogger} from 'testcafe';
import {APP_HTTP_API_URL} from './globals';

export function contains(logger: RequestLogger, requestPredicate: ((request: LoggedRequest) => boolean)) {
  return logger.contains(requestPredicate)
}

// const myObj = {'smth', x: 'other'} // https://github.com/DevExpress/testcafe/issues/2582
// const myObj2 = { APP_HTTP_API_URL, methodZZZ: 'post' };

// const requestLoggerFilter = `http://localhost:4200`

// const logger2 = RequestLogger()

// const urlFilter = /http:\/\/localhost:5656\/.*/;
// const requestLoggerFilter = { APP_HTTP_API_URL, method: 'post'};
export const logRequests = false;
const requestLoggerFilter = {url: APP_HTTP_API_URL, method: 'post'};
const urlFilter = new RegExp(APP_HTTP_API_URL + '.*');
export const logger = RequestLogger(urlFilter, {
  logResponseHeaders: true,
  logRequestHeaders: true,
  logRequestBody: true,
  logResponseBody: false,
  stringifyRequestBody: true,
  stringifyResponseBody: false,
});
