// Module imports
import React, {
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'





// Component imports
import NavLink from './NavLink'
import Subnav from './Subnav'





// Local constants
const hoverIntentTimeout = 2000





const Nav = props => {
  const {
    className,
    items,
  } = props

  const itemKeys = useRef({})
  const [subnavOpenStates, setSubnavOpenStates] = useState({})

  let timeoutID = null

  const handleSubnavStateChange = (subnavToOpen = null) => () => {
    setSubnavOpenStates(previousSubnavOpenStates => {
      const subnavKeys = Object.keys(previousSubnavOpenStates)
      const newSubnavOpenStates = subnavKeys.reduce((accumulator, subnavKey) => ({
        ...accumulator,
        [subnavKey]: subnavToOpen === subnavKey,
      }), {})

      return newSubnavOpenStates
    })
  }

  const handleEnterIntent = () => {
    timeoutID = setTimeout(handleSubnavStateChange(), hoverIntentTimeout)
  }

  const handleLeaveIntent = () => {
    if (timeoutID) {
      clearTimeout(timeoutID)
      timeoutID = null
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <nav
      className={className}
      onMouseOver={handleLeaveIntent}
      onMouseOut={handleEnterIntent}>
      <ul>
        {items.map((item, index) => {
          const {
            condition,
            subnav,
          } = item
          let key = item.key || itemKeys.current[index]

          if (condition && !condition(props)) {
            return null
          }

          if (!key) {
            key = uuid()
            itemKeys.current[index] = key
          }

          if (subnav && !subnavOpenStates[key]) {
            subnavOpenStates[key] = false
          }

          if (subnav) {
            return (
              <Subnav
                key={key}
                {...props}
                {...item}
                id={key}
                isOpen={subnavOpenStates[key]}
                onClose={handleSubnavStateChange()}
                onOpen={handleSubnavStateChange(key)} />
            )
          }

          return (
            <NavLink
              key={key}
              {...props}
              {...item} />
          )
        })}
      </ul>
    </nav>
  )
}

Nav.defaultProps = {
  className: '',
}

Nav.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
}





export default Nav
