"use client"

import { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import Section from './Section';

function ReserveButton() {
  const [open, isOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-0 w-full z-50">
      <Section outerC="!py-0 !px-0 !overflow-visible" innerC="px-6 md:px-10 lg:max-w-[1360px] mx-auto">
          {/* Decorative background */}
          <div className={`bg-primary h-24 w-full mb-2 rounded-4xl ${open ? "" : "hidden"}`}></div>

          {/* Floating button */}
          <button onClick={() => isOpen(!open)} className="w-20 h-20 flex items-center justify-center bg-primary ms-auto border-secondary rounded-full shadow-lg">
            <FaCalendarAlt className="w-8 h-auto text-secondary" />
          </button>

      </Section>
    </div>
  );
}

export default ReserveButton;
