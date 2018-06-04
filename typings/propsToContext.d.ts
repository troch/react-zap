import * as React from 'react'
export default function propsToContext<P, C extends P = P>(
    Provider: React.ComponentType<React.ProviderProps<C>>,
    config?: string[] | ((props: P) => C)
): (BaseComponent: React.ComponentType<P>) => React.ComponentClass<P>
