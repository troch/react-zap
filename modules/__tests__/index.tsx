import * as React from 'react'
import { render, mount } from 'enzyme'
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
        describe('when no config is passed', () => {
            it('should set all context to props', () => {
                const Spy = jest.fn().mockReturnValue(null)
                const context = { name: 'foo', surname: 'bar' }
                const Consumer = props => props.children(context)
                const Component = contextToProps<{}, P>(Consumer)(Spy)

                mount(<Component />)

                expect(Spy).toHaveBeenCalledWith(context, {})
            })
        })

        describe('when a string is passed as config', () => {
            it('should set the context to the defined prop key', () => {
                const Spy = jest.fn().mockReturnValue(null)
                const context = { name: 'foo', surname: 'bar' }
                const Consumer = props => props.children(context)
                const Component = contextToProps<{}, P>(Consumer, 'myContext')(
                    Spy
                )

                mount(<Component />)

                expect(Spy).toHaveBeenCalledWith({ myContext: context }, {})
            })
        })

        describe('when a function is passed as config', () => {
            it('should use the custom map function', () => {
                const Spy = jest.fn().mockReturnValue(null)
                const context = {
                    name: 'foo',
                    surname: 'bar',
                    keep: 'baz',
                    ignore: true
                }
                const mapToProps = (({ name, ignore, ...props }) => ({
                    rename: name,
                    ...props
                })) as ((props: any) => P)
                const Consumer = props => props.children(context)
                const Component = contextToProps<{}, P>(Consumer, mapToProps)(
                    Spy
                )

                mount(<Component />)

                expect(Spy).toHaveBeenCalledWith(
                    {
                        keep: 'baz',
                        rename: 'foo',
                        surname: 'bar'
                    },
                    {}
                )
            })
        })
    })
})
