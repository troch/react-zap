import * as React from 'react'
export default function contextToProps<P, C, MergedP>(
    Consumer: React.ComponentType<React.ConsumerProps<C>>,
    config?: string | ((props: P, context: C) => MergedP)
): (BaseComponent: React.ComponentType<P & C>) => React.ComponentClass<P>
