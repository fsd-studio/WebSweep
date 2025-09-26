"use client"

import { motion } from 'motion/react';
import { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import Section from './Section';

function ReserveButton() {
  const [open, isOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-0 w-full z-50">
      <Section outerC="!py-0 !px-0 !overflow-visible" innerC="px-6 md:px-10 lg:max-w-[1360px] mx-auto">
          {/* Decorative background */}
          <motion.div 
            initial={false}
            animate={open ? "open" : "closed"}
            variants={{
              open: { 
                opacity: 1,
                x: 0
              },

              closed: { 
                opacity: 0,
                x: 100
              },
            }}
            className={`bg-primary origin-bottom-right scale-100 h-24 max-w-[500px] ms-auto w-full mb-2 rounded-4xl`}>
          </motion.div>
            
          {/* Floating button */}
          <button onClick={() => isOpen(!open)} className="w-20 h-20 flex items-center justify-center bg-primary ms-auto border-secondary rounded-full shadow-lg">
            <FaCalendarAlt className="w-8 h-auto text-secondary" />
          </button>

      </Section>
    </div>
  );
}

export default ReserveButton;
