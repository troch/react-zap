import * as React from 'react'

function propsToProvider<P>(
    props: P,
    include: string[],
    exclude: string[]
): Partial<P> {
    if (!include.length) {
        return !exclude.length
            ? props
            : filterProps<P>(
                  props,
                  propName => exclude.indexOf(propName) === -1
              )
    }

    return filterProps<P>(props, propName => include.indexOf(propName) !== -1)
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
    config?: string[] | { include?: string[]; exclude?: string[] }
) {
    return (BaseComponent: React.ComponentType<P>): React.ComponentClass<P> =>
        class PropsToContext extends React.Component<P> {
            public include: string[] = []
            public exclude: string[] = []

            constructor(props) {
                super(props)

                if (Array.isArray(config)) {
                    this.include = config
                    this.exclude = []
                } else if (config) {
                    this.include = config.include || []
                    this.exclude = config.exclude || []
                }
            }

            public render() {
                return (
                    <Provider
                        value={
                            propsToProvider(
                                this.props,
                                this.include,
                                this.exclude
                            ) as C
                        }
                    >
                        <BaseComponent {...this.props} />
                    </Provider>
                )
            }
        }
}
