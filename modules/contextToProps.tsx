import * as React from 'react'

export default function contextToProps<P, C, MergedP = P & C>(
    Consumer: React.ComponentType<React.ConsumerProps<C>>,
    config?: string | ((props: P, context: C) => MergedP)
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
                    this.mergeToProps = (props, context) => ({
                        ...props,
                        [config]: context
                    })
                }
            }

            public mergeToProps = (props, context) => ({ ...props, ...context })

            public render() {
                return (
                    <Consumer>
                        {context =>
                            React.createElement(
                                BaseComponent,
                                this.mergeToProps(this.props, context)
                            )
                        }
                    </Consumer>
                )
            }
        }
}
