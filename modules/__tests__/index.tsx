import * as React from 'react'
import { render } from 'enzyme'
import { propsToContext, contextToProps } from '../'

interface P {
    name?: string
    surname?: string
}

describe('react-zap', () => {
    describe('propsToContext', () => {
        describe('when no config is passed', () => {
            it('should set all props to context', () => {
                const { Consumer, Provider } = React.createContext<P>({})
                const consumer = jest.fn().mockReturnValue(<div />)
                const BaseComponent = () => <Consumer>{consumer}</Consumer>
                const Component = propsToContext<P>(Provider)(BaseComponent)
                const output = render(<Component name="foo" surname="bar" />)

                expect(consumer).toHaveBeenCalledWith({
                    name: 'foo',
                    surname: 'bar'
                })
            })
        })

        describe('when an array is passed as config', () => {
            it('should set only the defined props to context', () => {
                const { Consumer, Provider } = React.createContext<P>({})
                const consumer = jest.fn().mockReturnValue(<div />)
                const BaseComponent = () => <Consumer>{consumer}</Consumer>
                const Component = propsToContext<P>(Provider, ['name'])(
                    BaseComponent
                )
                const output = render(<Component name="foo" surname="bar" />)

                expect(consumer).toHaveBeenCalledWith({ name: 'foo' })
            })
        })

        describe('when a function is passed as config', () => {
            it('should use the custom map function', () => {
                const { Consumer, Provider } = React.createContext<P>({})
                const consumer = jest.fn().mockReturnValue(<div />)
                const BaseComponent = () => <Consumer>{consumer}</Consumer>
                const Component = propsToContext<P, {}>(
                    Provider,
                    ({ name, ...props }) => props
                )(BaseComponent)
                const output = render(<Component name="foo" surname="bar" />)

                expect(consumer).toHaveBeenCalledWith({ surname: 'bar' })
            })
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
