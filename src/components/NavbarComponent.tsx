import { Navbar, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react'
import Link from 'next/link'
import React from 'react'

const NavbarComponent = () => {
  return (
    <Navbar fluid rounded>
        <NavbarToggle />
        <NavbarCollapse>
            <NavbarLink as={Link} href='/'>Login Page</NavbarLink>
            <NavbarLink as={Link} href='/Blogs'>Blog Page</NavbarLink>
            <NavbarLink as={Link} href='/Dashboard'>Dashboard Page</NavbarLink>
        </NavbarCollapse>
    </Navbar>

  )
}

export default NavbarComponent