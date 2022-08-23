/* eslint-disable */
export default {
  displayName: 'cugetreg-web',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: './custom-test-env.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/cugetreg-web',
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
