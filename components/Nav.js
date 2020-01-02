// Module imports
import React, {
  useState,
} from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'





// Component imports
import NavLink from './NavLink'
import Subnav from './Subnav'





// Local constants
const subnavOpenStates = {}
const closeAllSubnavs = () => {
  Object.keys(subnavOpenStates).forEach(id => {
    subnavOpenStates[id] = false
  })
}





const Nav = props => {
  const {
    className,
    isOpen,
    items,
  } = props

  const [itemKeys] = useState({})
  const [, setSubnavOpenStates] = useState(subnavOpenStates)

  return (
    <nav
      aria-expanded={isOpen}
      aria-hidden={!isOpen}
      className={className}>
      <ul>
        {items.map((item, index) => {
          const {
            condition,
            title,
            subnav,
          } = item
          let key = item.key || itemKeys[index]

          if (condition && !condition(props)) {
            return null
          }

          if (!key) {
            itemKeys[index] = uuid()
            key = itemKeys[index]
          }

          if (subnav && !subnavOpenStates[key]) {
            subnavOpenStates[key] = false
          }

          return (
            <li key={title}>
              {subnav && (
                <Subnav
                  key={key}
                  {...props}
                  {...item}
                  id={key}
                  isFocusable={isOpen}
                  isOpen={isOpen && subnavOpenStates[key]}
                  onClose={() => {
                    subnavOpenStates[key] = false
                    setSubnavOpenStates({ ...subnavOpenStates })
                  }}
                  onOpen={() => {
                    closeAllSubnavs()
                    subnavOpenStates[key] = true
                    setSubnavOpenStates({ ...subnavOpenStates })
                  }} />
              )}

              {!subnav && (
                <NavLink
                  key={key}
                  {...props}
                  {...item}
                  isFocusable={isOpen} />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

Nav.defaultProps = {
  className: '',
  isOpen: true,
}

Nav.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  items: PropTypes.array.isRequired,
}





export default Nav
