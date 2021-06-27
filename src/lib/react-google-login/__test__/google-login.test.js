import React from 'react'
import { create } from 'react-test-renderer'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { GoogleLogin } from '../src'

configure({ adapter: new Adapter() })

describe('Google Login', () => {
  describe('With default props', () => {
    const props = {
      onSuccess() {},
      onFailure() {},
      clientId: '658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com',
    }

    test('render the button', () => {
      const component = create(<GoogleLogin {...props} />)
      const tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })

    const button = shallow(<GoogleLogin {...props} />)

    test('does not have a class attr', () => {
      expect(button.prop('className')).toEqual(undefined)
    })

    test('has inline styles', () => {
      expect(button.prop('style')).toMatchSnapshot()
    })

    test('displays a button element when tag prop is not set', () => {
      expect(button.type()).toEqual('button')
    })
  })
  describe('With custom text and default props', () => {
    const buttonText = 'buttonText'

    const props = {
      onSuccess() {},
      onFailure() {},
      clientId: '658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com',
      buttonText,
    }

    test('render the button', () => {
      const component = create(<GoogleLogin {...props} />)
      const tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })

    const button = shallow(<GoogleLogin {...props} />)

    test('does not have a class attr', () => {
      expect(button.prop('className')).toEqual(undefined)
    })

    test('has inline styles', () => {
      expect(button.prop('style')).toMatchSnapshot()
    })

    test('displays a button element when tag prop is not set', () => {
      expect(button.type()).toEqual('button')
    })
  })
  describe('With custom class and default props', () => {
    const className = 'test-class'

    const props = {
      onSuccess() {},
      onFailure() {},
      clientId: '658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com',
      className,
    }

    test('render the button', () => {
      const component = create(<GoogleLogin {...props} />)
      const tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })

    const button = shallow(<GoogleLogin {...props} />)

    test('does not have a class attr', () => {
      expect(button.prop('className')).toEqual(className)
    })

    test('has inline styles', () => {
      expect(button.prop('style')).toMatchSnapshot()
    })

    test('displays a button element when tag prop is not set', () => {
      expect(button.type()).toEqual('button')
    })
  })
  describe('With custom class and custom style', () => {
    const className = 'test-class'
    const style = { color: 'red' }
    const props = {
      onSuccess() {},
      onFailure() {},
      clientId: '658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com',
      className,
      style,
    }

    test('render the button', () => {
      const component = create(<GoogleLogin {...props} />)
      const tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })

    const button = shallow(<GoogleLogin {...props} />)

    test('does not have a class attr', () => {
      expect(button.prop('className')).toEqual(className)
    })

    test('has inline styles', () => {
      expect(button.prop('style')).toMatchSnapshot()
    })

    test('displays a button element when tag prop is not set', () => {
      expect(button.type()).toEqual('button')
    })
  })
  describe('With children, custom text, and default props', () => {
    const children = 'test'
    const buttonText = 'buttonText'
    const props = {
      onSuccess() {},
      onFailure() {},
      clientId: '658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com',
      buttonText,
    }

    test('render the button', () => {
      const component = create(<GoogleLogin {...props}>{children}</GoogleLogin>)
      const tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })

    const button = shallow(<GoogleLogin {...props}>{children}</GoogleLogin>)

    test('does not have a class attr', () => {
      expect(button.prop('className')).toEqual(undefined)
    })

    test('has inline styles', () => {
      expect(button.prop('style')).toMatchSnapshot()
    })

    test('displays a button element when tag prop is not set', () => {
      expect(button.type()).toEqual('button')
    })
  })
  describe('With handles custom tag prop', () => {
    const tag = 'div'

    const props = {
      onSuccess() {},
      onFailure() {},
      clientId: '658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com',
      tag,
    }

    test('render the button', () => {
      const component = create(<GoogleLogin {...props} />)
      const tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })

    const button = shallow(<GoogleLogin {...props} />)

    test('does not have a class attr', () => {
      expect(button.prop('className')).toEqual(undefined)
    })

    test('has inline styles', () => {
      expect(button.prop('style')).toMatchSnapshot()
    })

    test('displays a button element when tag prop is not set', () => {
      expect(button.type()).toEqual(tag)
    })
  })
})
