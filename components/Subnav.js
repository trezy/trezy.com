// Module imports
import React, {
  useState,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'





// Component imports
import NavLink from './NavLink'





const Subnav = props => {
  const {
    iconOnly,
    id,
    isFocusable,
    isOpen,
    onClose,
    onOpen,
    subnav,
  } = props

  const className = typeof props.className === 'function' ? props.className(props) : props.className
  const icon = typeof props.icon === 'function' ? props.icon(props) : props.icon
  const iconPrefix = typeof props.iconPrefix === 'function' ? props.iconPrefix(props) : props.iconPrefix
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

  if (title instanceof Symbol) {
    titleComponent = title
  } else {
    titleComponent = (
      <span className={classnames({ 'screen-reader-only': iconOnly })}>
        {title}
      </span>
    )
  }

  const [subkeys] = useState({})

  const onStateChange = () => {
    if (isOpen) {
      onClose()
    } else {
      onOpen()
    }
  }

  return (
    <React.Fragment key={id}>
      <input
        aria-hidden
        checked={isOpen}
        className="subnav-toggle"
        hidden
        id={id}
        name="subnav"
        readOnly
        type="radio" />

      {/* eslint-disable jsx-a11y/tabindex-no-positive,jsx-a11y/no-noninteractive-element-to-interactive-role */}
      <label
        className={className}
        htmlFor={id}
        onClick={onStateChange}
        onKeyUp={event => {
          if (['enter', ' '].includes(event.key.toLowerCase())) {
            onStateChange()
          }
        }}
        role="button"
        tabIndex={isFocusable ? 0 : -1}>
        <span>
          {iconComponent}

          {titleComponent}
        </span>
      </label>
      {/* eslint-enable jsx-a11y/tabindex-no-positive,jsx-a11y/no-noninteractive-element-to-interactive-role */}

      <ul
        aria-expanded={isOpen ? 'true' : 'false'}
        className="subnav">
        {subnav.map((item, index) => {
          let subkey = item.key || subkeys[index]

          if (!subkey) {
            subkeys[index] = uuid()
            subkey = subkeys[index]
          }

          return (
            <NavLink
              {...item}
              isFocusable={isOpen}
              key={subkey} />
          )
        })}
      </ul>
    </React.Fragment>
  )
}

Subnav.defaultProps = {
  className: '',
  icon: null,
  iconComponent: null,
  iconOnly: false,
  iconPrefix: null,
  isFocusable: true,
  onClose: () => {},
  onOpen: () => {},
}

Subnav.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  icon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  iconComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  iconOnly: PropTypes.bool,
  iconPrefix: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  id: PropTypes.string.isRequired,
  isFocusable: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  subnav: PropTypes.array.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]).isRequired,
}





export default Subnav
