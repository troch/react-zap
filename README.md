[![npm version](https://badge.fury.io/js/react-zap.svg)](http://badge.fury.io/js/react-zap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/troch/react-zap.svg)](https://travis-ci.org/troch/react-zap)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# react-zap

:zap: Zap props from one React component to another! :zap:

## Why?

React's new context API allows you to send data from one component to any component in its tree of children. React-zap lets you tie this powerful new feature in to the similarly powerful concept of higher-order components!

## HoCs _and_ Render Props?

One aspect of the new context API which has been much talked about in the community is that it uses the `function-as-a-child` pattern (also called `render props`) for its Consumers. This pattern has been positioned by some as an alternative to higher-order components, so the general impression is that you need to choose: either use HoCs or use Render Props.

However, the API is about sharing dynamic context, not about render functions. The ability to pass data directly to any child is applicable to many situations; the method with which you access this data is not relevant to the feature. And in fact, this feature can be combined with higher-order components to make it even more powerful!

**HoCs are not dead**! This package allows you to use your trusted and useful HoCs and to plug them into React's new context API.

This package offers two higher-order components: `propsToContext` to populate a context provider with existing props, and `contextToProps` if you prefer to consume context with a HoC (for example within a `compose` function).

## API

### :zap: `propsToContext(Provider, config?)(BaseComponent)`

Wraps your component with the specified `Provider`, and sends the component's props into context. By default, all props will be included in context; you can optionally define a list of props to include, or a function to map the props manually.

*   `Provider`: a React context provider, returned by `React.createContext`
*   `config`:
    * An array of prop keys to sent to context.

        Example: `propsToContext(Provider, ['propToInclude'])(Component)`

    * A function mapping props to context.

        Example: `propsToContext(Provider, ({ propToIgnore, ...otherProps }) => otherProps)(Component)`

### :zap: `contextToProps(Consumer, config?)(BaseComponent)`

Wraps your component with the specified `Consumer`, and sends the context into its props. By default, the context will be spread into the component's props; you can optionally define a prop key for the context object, or a function to map to props manually.

*   `Consumer`: a React context consumer, returned  by `React.createContext`
*   `config` (optional):
    * A string, to be used as a prop key for the context object.

        Example: `contextToProps(Consumer, 'allContext')(Component)`

    * A function mapping context to props.

        Example: `contextToProps(Consumer, ({ contextToIgnore, ...otherContexts }) => otherContexts)(Component)`

## Examples

### With a state HOC

Using [react-state-hoc](troch/react-state-hoc). We will first create our context components:

```js
import React from 'react'

const initialState = {
    visible: false
}

const {
    Provider: StateProvider,
    Consumer: StateConsumer
} = React.createContext(initialState)

export { initialState, StateProvider, StateConsumer }
```

Given an imaginary `ViewComponent`, we will set our state in context using `propsToContext`. Note the use of a `compose` function to compose our different higher-order components, provided by some libraries like `redux` ([you can write your own!](https://gist.github.com/JamieMason/172460a36a0eaef24233e6edb2706f83))

```js
import React from 'react'
import { propsToContext } from 'react-zap'
import { withState } from 'react-state-hoc'

import { initialState, StateProvider } from './context'
import ViewComponent from './ViewComponent'

export default compose(
    withState(initialState, {
        setVisibility: visible => ({ visible })
    })
    propsToContext(StateProvider, [ 'visible', 'setVisibility' ])
)(ViewComponent)
```

Now the state in `withState` will be added to our provider. Note that we have whitelisted props `'visible'` and `'setVisibility'`. To consume it, given `ToggleButton` and `Toggle` components mounted somewhere deep in `ViewComponent`:

```js
import React from 'react'
import { contextToProps } from 'react-zap'
import { StateConsumer } from './context'

const withState = contextToProps(StateConsumer)

const ToggleButton = ({ setVisibility }) => (
    <button onClick={() => setVisibility(!visible)}>
        Toggle
    </button>
)

const Toggle = ({ visible }) => visible ? <div>Hello</div> : null

export {
    ToggleButton: withState(ToggleButton),
    Toggle: withState(Toggle)
}
```

With render functions instead of `contextToProps` HoC:

```js
import React from 'react'
import { StateConsumer } from './context'

export function ToggleButton() {
    return (
        <StateConsumer>
            {({ visible, setVisibility }) => (
                <button onClick={() => setVisibility(!visible)}>Toggle</button>
            )}
        </StateConsumer>
    )
}

export function Toggle() {
    return (
        <StateConsumer>
            {({ visible, setVisibility }) =>
                visible ? <div>Hello</div> : null
            }
        </StateConsumer>
    )
}
```

### With redux `connect`

The same logic applies with a higher-order component like `connect` from the `react-redux` package:

```js
import React from 'react'
import { propsToContext } from 'react-zap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import ViewComponent from './ViewComponent'
import ViewChild from './ViewChild'

const { Provider, Consumer } = React.createContext()

// Set context for any component in `ViewComponent`
// All props received by `propsToContext` will be set to `Provider`,
// including what is returned by `mapStateToProps` and `mapDispatchToProps`
const ViewContainer = compose(
    connect(mapStateToProps, mapDispatchToProps),
    propsToContext(Provider)
)(ViewComponent)

// No we can consume our context in any descendant!
const ViewChild = () => <Consumer>{context => <div />}</Consumer>
```
