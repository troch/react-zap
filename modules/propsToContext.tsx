import * as React from 'react'

function createPropsToProvider<P>(include: string[]): (props: P) => Partial<P> {
    return function (props: P): Partial<P> {
        return filterProps<P>(props, propName => include.indexOf(propName) !== -1)
    }
}

function filterProps<P>(
    props: P,
    predicate: (propName: string) => boolean
): Partial<P> {
    return Object.keys(props).reduce((p: Partial<P>, propName: string) => {
        if (predicate(propName)) {
            p[propName] = props[propName]
        }

        return p
    }, {})
}

export default function propsToContext<P, C extends P = P>(
    Provider: React.ComponentType<React.ProviderProps<C>>,
    config?: string[] | ((props: P) => C)
) {
    return (BaseComponent: React.ComponentType<P>): React.ComponentClass<P> =>
        class PropsToContext extends React.Component<P> {
            public propsToProvider = props => props

            constructor(props) {
                super(props)

                if (typeof config === 'function') {
                    this.propsToProvider = config
                } else if (config) {
                    this.propsToProvider = createPropsToProvider(config)
                }
            }

            public render() {
                return (
                    <Provider
                        value={
                            this.propsToProvider(
                                this.props,
                            ) as C
                        }
                    >
                        <BaseComponent {...this.props} />
                    </Provider>
                )
            }
        }
}
