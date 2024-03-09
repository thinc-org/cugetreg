import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import Adapter from '@zarconontol/enzyme-adapter-react-18'
import Enzyme from 'enzyme'
import { afterEach, expect } from 'vitest'

Enzyme.configure({ adapter: new Adapter() })

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
