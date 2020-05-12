// Module imports
import React, {
  useEffect,
  useRef,
  useState,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'





// Component imports
import Button from './Button'
import NavLink from './NavLink'





const Subnav = props => {
  const {
    condition,
    iconOnly,
    id,
    isOpen,
    onClose,
    onOpen,
    subnav,
  } = props

  const firstItemRef = useRef(null)
  const [subkeys] = useState({})

  useEffect(() => {
    if (isOpen) {
      firstItemRef.current.focus()
    }
  }, [isOpen])

  if (condition && !condition(props)) {
    return null
  }

  const passableProps = { ...props }

  delete passableProps.className
  delete passableProps.icon
  delete passableProps.iconComponent

  const className = typeof props.className === 'function' ? props.className(props) : props.className
  const icon = typeof props.icon === 'function' ? props.icon(props) : props.icon
  const iconPrefix = typeof props.iconPrefix === 'function' ? props.iconPrefix(props) : props.iconPrefix
  const label = typeof props.label === 'function' ? props.label(props) : props.label
  const title = typeof props.title === 'function' ? props.title(props) : props.title

  let iconComponent = null
  let titleComponent = null

  if (props.iconComponent) {
    if (typeof props.iconComponent === 'function') {
      iconComponent = props.iconComponent(props)
    } else {
      iconComponent = props.iconComponent
    }
  } else if (icon) {
    iconComponent = (
      <FontAwesomeIcon
        aria-hidden={!iconOnly}
        fixedWidth
        icon={[(iconPrefix || 'fas'), icon]}
        title={title} />
    )
  }

  if (!iconOnly) {
    if (title instanceof Symbol) {
      titleComponent = title
    } else {
      titleComponent = (
        <span>
          {title}
        </span>
      )
    }
  }

  const onToggle = () => {
    if (isOpen) {
      onClose()
    } else {
      onOpen()
    }
  }

  return (
    <li key={title}>
      <nav
        aria-label={label || title}
        className={classnames(className, 'subnav')}
        key={id}>
        <Button
          aria-label={`${isOpen ? 'Close' : 'Expand'} ${label || title} navigation`}
          className={classnames(className, 'iconic')}
          onClick={onToggle}>
          {iconComponent}
          {titleComponent}
        </Button>

        <ul
          aria-expanded={isOpen ? 'true' : 'false'}
          hidden={!isOpen}>
          {subnav.map((item, index) => {
            if (item.condition && !item.condition(props)) {
              return null
            }

            const itemProps = {
              ...passableProps,
              ...item,
            }
            let subkey = item.key || subkeys[index]

            if (!subkey) {
              subkeys[index] = uuid()
              subkey = subkeys[index]
            }

            if (index === 0) {
              itemProps.ref = firstItemRef
            }

            return (
              <NavLink
                {...itemProps}
                key={subkey} />
            )
          })}
        </ul>
      </nav>
    </li>
  )
}

Subnav.defaultProps = {
  className: '',
  condition: null,
  icon: null,
  iconComponent: null,
  iconOnly: false,
  iconPrefix: null,
  label: null,
  onClose: () => {},
  onOpen: () => {},
}

Subnav.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  condition: PropTypes.func,
  icon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  iconComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
      PropTypes.node,
    ])),
  ]),
  iconOnly: PropTypes.bool,
  iconPrefix: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  subnav: PropTypes.array.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]).isRequired,
}





export default Subnav
