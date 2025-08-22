import Nav from './Nav'

export default {
  title: 'Components/Nav',
  component: Nav,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A basic navigation menu.'
      }
    }
  },
  argTypes: {
    
  },
  args: {
    children: 'Nav',
  }
}

// All variants showcase
export const nav = {

  render: () => (
    <Nav></Nav>
  )
}
