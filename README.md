# react-zap

Zap props from a component to another, using the new context API!

## Why?

You might have heard about React's new context API. I you have not read the [official documnetation](https://reactjs.org/docs/context.html) or this [medium article from Kent C. Dodds](https://medium.com/dailyjs/reacts-%EF%B8%8F-new-context-api-70c9fe01596b).

The React new context API allows you set and access data (context) without having to pass props all the way down to components which need them. Consumers accept a function as a child, for context data to be passed along: it's a pretty trendy pattern these days which has been called "render props".

People promoting render props have done it by trying to shoot down higher-order components. I use HoCs a lot (really a lot) and for a while I have contemplated React's new context API as something I would be unable to leverage: it is HoCs or render props, make your choice.

It turns out, **React new context API is about sharing dynamic context**, not about render functions. **HoCs are not dead**, this package allows you to use your trusted and useful HoCs, and to plug them to React new context API!

This package offers two higher-order components: `propsToContext` to populate a context provider with existing props, and optionally `contextToProps` if you prefer to consume context with a HoC.

## API

### `contextToProps(Provider, config?)(BaseComponent)`

*   `Provider`: a React context provider, returned by `React.createContext`
*   `config`: a list of prop keys to set to context. Alternatively `config` can be an object containing `include` and `exclude`. It is optional and by default all props will be set to context.

### `propsToContext(Consumer)(BaseComponent)`

Totally optional higher-order component. If you decide to use it, it will spread the context pushed by `Consumer` to `BaseComponent` props. If you prefer to use render functions, use `Consumer` the normal way!

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
    Consumer: stateConsumer
} = React.createContext(initialState)

export { initialState, StateProvider, StateConsumer }
```

Given an imaginary `ViewComponent`, we will set our state in context using `propsToContext`. Note the use of a `compose` function to compose our different higher-order components, provided by some libraries like `redux` ([you can write your own!](https://gist.github.com/JamieMason/172460a36a0eaef24233e6edb2706f83))

```js
import React from 'react'
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
