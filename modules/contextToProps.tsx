import * as React from 'react'

export default function contextToProps<P, C>(
    Consumer: React.ComponentType<React.ConsumerProps<C>>,
    config?: string | ((props: P) => C)
) {
    return (
        BaseComponent: React.ComponentType<P & C>
    ): React.ComponentClass<P> =>
        class ContextToProps extends React.Component<P> {
            constructor(props) {
                super(props)

                if (typeof config === 'function') {
                    this.mergeToProps = config
                } else if (config) {
                    this.mergeToProps = (context, props) => ({
                        ...props,
                        [config]: context
                    })
                }
            }

            public mergeToProps = (context, props) => ({ ...props, ...context })

            public render() {
                return (
                    <Consumer>
                        {context =>
                            React.createElement(
                                BaseComponent,
                                this.mergeToProps(context, this.props)
                            )
                        }
                    </Consumer>
                )
            }
        }
}
