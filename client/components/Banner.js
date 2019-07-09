// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect } from 'react'
import Router from 'next/router'





// Component imports
import { Link } from '../routes'
import Nav from './Nav'





const Banner = () => {
  const [isOpen, setIsOpen] = useState(false)

  const close = () => {
    document.querySelector('[role=banner] *:focus').blur()
    setIsOpen(false)
  }

  const handleEscapeKey = ({ key }) => {
    if (key.toLowerCase() === 'escape') {
      close()
    }
  }

  useEffect(() => {
    Router.events.on('routeChangeComplete', close)

    return () => Router.events.off('routeChangeComplete', close)
  })

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keyup', handleEscapeKey)
    }

    return () => {
      if (isOpen) {
        document.removeEventListener('keyup', handleEscapeKey)
      }
    }
  })

  return (
    <>
      <input
        aria-label="Banner &amp; Navigation toggle"
        checked={isOpen}
        hidden
        id="banner-control"
        onChange={({ target: { checked } }) => setIsOpen(checked)}
        type="checkbox" />

      <header role="banner">
        <label
          aria-pressed={isOpen ? 'true' : 'false'}
          className="button primary"
          htmlFor="banner-control"
          onKeyUp={({ key }) => ['enter', ' '].includes(key.toLowerCase()) && setIsOpen(!isOpen)}
          role="button"
          tabIndex="0"
          title="Expand/Collapse Menu">
          <FontAwesomeIcon
            data-animate
            data-animation={`fade-${isOpen ? 'out' : 'in'}`}
            data-animation-duration="0.2s"
            fixedWidth
            icon="bars" />

          <FontAwesomeIcon
            data-animate
            data-animation={`fade-${isOpen ? 'in' : 'out'}`}
            data-animation-duration="0.2s"
            fixedWidth
            icon="times" />
        </label>

        <Link href="/">
          {/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
          <a
            className="brand"
            route="home"
            tabIndex={isOpen ? null : '-1'}
            title="Home">
            Brand!
          </a>
          {/* eslint-enable */}
        </Link>

        <Nav isOpen={isOpen} />
      </header>
    </>
  )
}





export default Banner
