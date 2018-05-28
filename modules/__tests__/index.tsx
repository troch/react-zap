import * as React from 'react'
import { render } from 'enzyme'
import { propsToContext, contextToProps } from '../'

interface P {
    name?: string
}

describe('react-zap', () => {
    describe('propsToContext', () => {
        it('should set props to context', () => {
            const { Consumer, Provider } = React.createContext<P>({})
            const consumer = jest.fn().mockReturnValue(<div />)
            const BaseComponent = () => <Consumer>{consumer}</Consumer>
            const Component = propsToContext<P>(Provider, {
                include: ['name'],
                exclude: []
            })(BaseComponent)
            const output = render(<Component name="foo" />)

            expect(consumer).toHaveBeenCalledWith({ name: 'foo' })
        })
    })

    describe('contextToProps', () => {
        it('should set context to props', () => {
            const { Consumer, Provider } = React.createContext<P>({})
            const BaseComponent = ({ name }) => <div>{name}</div>
            const Component = contextToProps<{}, P>(Consumer)(BaseComponent)
            const output = render(
                <Provider value={{ name: 'foo' }}>
                    <Component />
                </Provider>
            )

            expect(output.html()).toContain('foo')
        })
    })
})
