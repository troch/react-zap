/// <reference types="react" />
import * as React from 'react';
export default function propsToContext<P, C extends P = P>(Provider: React.ComponentType<React.ProviderProps<C>>, config?: string[] | {
    include?: string[];
    exclude?: string[];
}): (BaseComponent: React.ComponentType<P>) => React.ComponentClass<P>;
