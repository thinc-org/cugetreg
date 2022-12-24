/* eslint-disable */
export default {
  displayName: 'react-ui',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transform: {
    // '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/react-ui',
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
