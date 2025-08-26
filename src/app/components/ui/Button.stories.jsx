import Button from './Button'

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
      description: 'Visual style variant of the button'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the button'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled'
    },
    outline: {
      control: { type: 'boolean' },
      description: 'Whether the button is outlined'
    },
    children: {
      control: { type: 'text' },
      description: 'Button text content'
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes'
    }
  },
  args: {
    children: 'Button',
  }
}

// All variants showcase
export const AllVariants = {
  args: {
    outline: true
  },

  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
    </div>
  )
}

// All sizes showcase
export const AllSizes = {
  args: {
    outline: true,
    disabled: true
  },

  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
      <Button variant="primary" size="xl">Extra Large</Button>
    </div>
  )
}

// Interactive examples
export const WithClickHandler = {
  args: {
    variant: 'primary',
    children: 'Click Me!',
    onClick: () => alert('Button clicked!'),
    outline: true
  },
}