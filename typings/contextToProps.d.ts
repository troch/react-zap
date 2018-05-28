/// <reference types="react" />
import * as React from 'react';
export default function contextToProps<P, C>(Consumer: React.ComponentType<React.ConsumerProps<C>>): (BaseComponent: React.ComponentType<P & C>) => React.StatelessComponent<P>;
