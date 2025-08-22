import React, { useState } from 'react'
import Button from './Button'
import { motion } from "motion/react"

const Nav = ({ 
  children, 
  logo = '/LOGO-PRIMARY.png',
  links = ["one", "two", "three"],
  ...props 
}) => {

  const [mobileOpen, setMobileOpen] = useState(false)
  
  return (
    <div className='left-0 absolute w-full top-0'>
      <nav 
        className='h-16 flex items-center px-4 justify-between bg-secondary'
      >
        <a href="/">
          <img src={logo} className='h-10 w-auto' alt="logo" />
        </a>
        {children}

        <div className='hidden lg:flex gap-6'>
          {links.map((title) => (
            <a className='text-primary' href={`/#${title}`} key={title}>{title}</a>
          ))}
        </div>

        <div className='lg:hidden flex items-center'>
          <Button className='!bg-opacity-0' size="md" onClick={() => setMobileOpen(!mobileOpen)} variant='primary'>open</Button>
        </div>
      </nav>
      <div className={`${mobileOpen ? "block" : "hidden"} px-4 bg-secondary/90`}>
        {links.map((title) => (
          <a className='text-primary' href={`/#${title}`} key={title}>{title}</a>
        ))}
      </div>
    </div>

  )
}

export default Nav