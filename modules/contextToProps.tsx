import * as React from 'react'

export default function contextToProps<P, C>(
    Consumer: React.ComponentType<React.ConsumerProps<C>>
) {
    return (
        BaseComponent: React.ComponentType<P & C>
    ): React.StatelessComponent<P> => {
        function ContextToProps(props) {
            return (
                <Consumer>
                    {context => <BaseComponent {...props} {...context} />}
                </Consumer>
            )
        }

        return ContextToProps
    }
}
