import Hero from './Hero'

export default {
  title: 'Components/Hero',
  component: Hero,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Basic image text hero section.'
      }
    }
  },
  argTypes: {
    
  },
  args: {
    children: 'Hero',
  }
}

// All variants showcase
export const hero = {

  render: () => (
    <Hero></Hero>
  )
}
