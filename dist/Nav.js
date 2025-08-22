'use client';

import React, { useState } from 'react';
import Button from './Button.jsx';
import { motion } from "motion/react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Nav = ({
  children,
  logo = '/LOGO-PRIMARY.png',
  links = ["one", "two", "three"],
  ...props
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return /*#__PURE__*/_jsxs("div", {
    className: "left-0 absolute w-full top-0",
    children: [/*#__PURE__*/_jsxs("nav", {
      className: "h-16 flex items-center px-4 justify-between bg-secondary",
      children: [/*#__PURE__*/_jsx("a", {
        href: "/",
        children: /*#__PURE__*/_jsx("img", {
          src: logo,
          className: "h-10 w-auto",
          alt: "logo"
        })
      }), children, /*#__PURE__*/_jsx("div", {
        className: "hidden lg:flex gap-6",
        children: links.map(title => /*#__PURE__*/_jsx("a", {
          className: "text-primary",
          href: `/#${title}`,
          children: title
        }, title))
      }), /*#__PURE__*/_jsx("div", {
        className: "lg:hidden flex items-center",
        children: /*#__PURE__*/_jsx(Button, {
          className: "!bg-opacity-0",
          size: "md",
          onClick: () => setMobileOpen(!mobileOpen),
          variant: "primary",
          children: "open"
        })
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: `${mobileOpen ? "block" : "hidden"} px-4 bg-secondary/90`,
      children: links.map(title => /*#__PURE__*/_jsx("a", {
        className: "text-primary",
        href: `/#${title}`,
        children: title
      }, title))
    })]
  });
};
export default Nav;