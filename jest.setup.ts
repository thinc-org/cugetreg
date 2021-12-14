// DOM rendering
import '@testing-library/jest-dom'
// Shallow rendering
import { configure } from 'enzyme'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17')
configure({ adapter: new Adapter() })
