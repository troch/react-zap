import * as React from 'react'
export default function contextToProps<P, C>(
    Consumer: React.ComponentType<React.ConsumerProps<C>>,
    config?: string | ((props: P) => C)
): (BaseComponent: React.ComponentType<P & C>) => React.ComponentClass<P>
