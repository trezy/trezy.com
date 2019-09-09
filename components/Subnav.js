// Module imports
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import uuid from 'uuid/v4'





// Component imports
import NavLink from './NavLink'
import renderNavItemTitle from '../helpers/renderNavItemTitle'





const Subnav = props => {
  const {
    isFocusable,
    subnav,
    title,
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const key = uuid()

  return (
    <React.Fragment key={key}>
      <input
        aria-hidden
        className="subnav-toggle"
        hidden
        id={key}
        checked={isOpen}
        name="subnav"
        type="radio" />

      <label
        htmlFor={key}
        onClick={() => setIsOpen(!isOpen)}
        onKeyUp={event => ['enter', ' '].includes(event.key.toLowerCase()) && setIsOpen(!isOpen)}
        role="button"
        tabIndex={isFocusable ? 0 : -1}>
        <span>
          {renderNavItemTitle(props, title)}
        </span>
      </label>

      <ul
        aria-expanded={isOpen ? 'true' : 'false'}
        className="subnav">
        {subnav.map(item => (
          <NavLink
            {...item}
            isFocusable={isOpen}
            key={item.key}
            title={renderNavItemTitle(item, item.title)} />
        ))}
      </ul>
    </React.Fragment>
  )
}

Subnav.defaultProps = {
  isFocusable: true,
}

Subnav.propTypes = {
  isFocusable: PropTypes.bool,
  subnav: PropTypes.array.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]).isRequired,
}





export default Subnav
