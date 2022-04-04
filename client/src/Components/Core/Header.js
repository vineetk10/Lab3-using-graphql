import React from 'react'
import Categories from './Categories'
import EtsyNavbar from './Navbar'

function Header() {
  return (
    <div>
        <EtsyNavbar/>
        <Categories/>
        <hr
          style={{
              color: 'black',
              backgroundColor: 'black',
              height: 1.5
          }}
      />
    </div>
  )
}

export default Header