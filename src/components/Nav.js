// Module imports
import React, {
  useRef,
  useState,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'





// Component imports
import Button from 'components/Button'
import NavLink from 'components/NavLink'
import Subnav from 'components/Subnav'





// Local constants
const hoverIntentTimeout = 2000





const Nav = props => {
  const {
    className,
    isOpen,
    items,
    onToggle,
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
    // We're specifically not adding key events to the main nav because a
    // keyboard user won't expect the nav to suddenly close without their
    // direct interaction.
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <nav
      className={className}
      onMouseOver={handleLeaveIntent}
      onMouseOut={handleEnterIntent}>
      {Boolean(onToggle) && (
        <Button
          aria-label={`${isOpen ? 'Collapse' : 'Expand'} main navigation`}
          aria-pressed={isOpen}
          className="button iconic primary"
          id="banner-control"
          onClick={onToggle}>
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
        </Button>
      )}

      <ul hidden={!isOpen}>
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
  isOpen: true,
  onToggle: null,
}

Nav.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  items: PropTypes.array.isRequired,
  onToggle: PropTypes.func,
}





export default Nav
