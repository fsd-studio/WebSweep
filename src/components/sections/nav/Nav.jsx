'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import HamburgerMenu from '../../ui/HamburgerMenu.jsx';
import Section from '../../ui/Section.jsx';

import { useTranslation } from 'next-i18next';
import { LangSwitcherMinimalist, LangSwitcherMobile } from './LangSwitcher.jsx';

const Nav = ({ 
  children, 
  logo = '/template/logo.png',
  ...props 
}) => {
  const { t } = useTranslation('nav');

  const links = [t('about'), t('menu'), t('gallery'), t('contact')];
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`overflow-hidden ${mobileOpen && "no-doc-scroll"}`}>
      
      {/* navigation bar */}
      <div className='left-0 fixed w-full z-50 top-0 '>
        <nav>
          <Section outerC="!py-0">
            <div className='flex items-center h-20 md:h-28 lg:h-26 justify-between w-full'>
              {/* Logo */}
              <a href="/">
                <img src={logo} className='h-10 md:h-[60px] w-auto' alt="logo" />
              </a>
              
              {children}
              
              <div>
                <LangSwitcherMinimalist />
              </div>

              {/* Large screen navigation */}
              <div className='hidden lg:flex gap-6'>
                {links.map((title, index) => (
                  <a key={index} className='text-primary text-2xl font-light font-serif' href={`/#${title}`}>{title}</a>
                ))}
              </div>


              {/* Mobile menu button */}
              <div className='lg:hidden flex items-center'>
                <HamburgerMenu onClick={() => setMobileOpen(!mobileOpen)} isOpen={mobileOpen} />
              </div>
            </div>
          </Section>
        </nav>
      </div>

      <div className='h-20 md:h-28 lg:h-26 bg-secondary'></div>

      {/* Expanded mobile menu */}
      <motion.nav initial={false}
        animate={mobileOpen ? "open" : "closed"}
        variants={{
          open: { 
            scaleY: 1,
            transition: {
              delayChildren: 0.3,
              staggerChildren: 0.1,
              ease: [0.12, 0, 0.29, 0]
            },
          },

          closed: { 
            scaleY: 0,
            transition: {
              duration: .6,
              delay: 0.5,              
              staggerChildren: 0.1,
              staggerDirection: -1,
              ease: [0.22, 1, 0.36, 1]
            },
          },
        }}
        className={`lg:hidden bg-primary origin-top fixed z-40 top-0 left-0 h-screen w-full overflow-hidden`}>
          <div className='flex flex-col justify-center items-center h-full'>
            {links.map((title, index) => (
              <div key={index} className='overflow-hidden'>
                <motion.a variants={{
                  open: {
                    y: 0,
                  },
                  closed: {
                    y: 50,
                  }
                }} 
      
                className='text-secondary text-3xl text-center font-serif w-full block mt-6' href={`/#${title}`}>{title}</motion.a>
              </div>
            ))}

            <LangSwitcherMobile></LangSwitcherMobile>
          </div>
      </motion.nav>
    </div>

  )
}

export default Nav