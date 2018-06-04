import * as React from 'react'

function createPropsToProvider<P, C>(include: string[]): (props: P) => C {
    return (props: P): C =>
        filterProps<P, C>(props, propName => include.indexOf(propName) !== -1)
}

function filterProps<P, C>(
    props: P,
    predicate: (propName: string) => boolean
): C {
    return Object.keys(props).reduce((p: Partial<C>, propName: string) => {
        if (predicate(propName)) {
            p[propName] = props[propName]
        }

        return p
    }, {}) as C
}

export default function propsToContext<P, C extends P = P>(
    Provider: React.ComponentType<React.ProviderProps<C>>,
    config?: string[] | ((props: P) => C)
) {
    return (BaseComponent: React.ComponentType<P>): React.ComponentClass<P> =>
        class PropsToContext extends React.Component<P> {
            constructor(props) {
                super(props)

                if (typeof config === 'function') {
                    this.propsToProvider = config
                } else if (config) {
                    this.propsToProvider = createPropsToProvider<P, C>(config)
                }
            }

            public propsToProvider = props => props

            public render() {
                return (
                    <Provider value={this.propsToProvider(this.props)}>
                        <BaseComponent {...this.props} />
                    </Provider>
                )
            }
        }
}
