import React from 'react'
import TestRenderer from 'react-test-renderer'
import { withStateChart } from '../src'

const initiaState = 'a'
const event = 'EVENT'

const machine = {
  initial: initiaState,
  states: {
    [initiaState]: {
      on: {
        [event]: 'b',
      },
    },
    b: {
      on: {
        [event]: initiaState,
      },
      onEntry: 'onEnterB',
    },
  },
}

test('state', () => {
  const initialData = { counter: 0 }
  const Component = () => <div />
  const StateMachine = withStateChart(machine, { initialData })(Component)
  const renderer = TestRenderer.create(<StateMachine />)
  const instance = renderer.getInstance()
  const component = renderer.root.findByType(Component)

  expect(component.props.counter).toBe(0)

  instance.handleTransition(event, { counter: 1 })

  expect(component.props.counter).toBe(1)

  instance.handleTransition(event, prevState => ({
    counter: prevState.counter + 1,
  }))

  expect(component.props.counter).toBe(2)
})

test('actions', () => {
  const spy = jest.fn()

  class Component extends React.Component {
    onEnterB() {
      spy()
    }

    render() {
      return <div />
    }
  }

  const StateMachine = withStateChart(machine)(Component)
  const instance = TestRenderer.create(<StateMachine />).getInstance()

  instance.handleTransition(event)

  expect(spy).toHaveBeenCalledTimes(1)
})