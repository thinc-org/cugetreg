/* eslint-disable */
const { TestEnvironment } = require('jest-environment-jsdom')

module.exports = class CustomTestEnvironment extends TestEnvironment {
  async setup() {
    await super.setup()
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder, TextDecoder } = require('util')
      this.global.TextEncoder = TextEncoder
      this.global.TextDecoder = TextDecoder
    }
  }
}
