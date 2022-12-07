// DOM rendering
import '@testing-library/jest-dom'
// Shallow rendering
import { configure } from 'enzyme'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Adapter = require('@zarconontol/enzyme-adapter-react-18')
configure({ adapter: new Adapter() })
