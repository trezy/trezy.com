/* eslint-disable react/no-multi-comp */

// Module imports
import classnames from 'classnames'
import NextHead from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import ContentInfo from './ContentInfo'





// Component constants
const MAX_TITLE_LENGTH = 50
const MAX_DESCR_LENGTH = 300





class PageWrapper extends React.Component {
  constructor (props) {
    super(props)

    /* eslint-disable no-console */
    if (this.props.title.length > MAX_TITLE_LENGTH) {
      console.warn(`Page titles should be fewer than 60 characters, preferably closer to 50. This page's title is ${this.props.title.length} characters.`)
    }

    if (this.props.description.length > MAX_DESCR_LENGTH) {
      console.error(`Page description is too long! The description should be 50-300 characters long, but this page's description is ${this.props.description.length} characters.`)
    }

    if (this.props.description.indexOf('"') !== -1) {
      console.error('Page descriptions shouldn\'t contain double quotes.')
    }
    /* eslint-enable no-console */
  }

  render () {
    const {
      children,
      className,
      description,
      title,
    } = this.props

    return (
      <>
        <NextHead>
          <title>{title} | Trezy.com</title>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:type" content="website" />
          <meta property="twitter:card" content="summary" />
          <meta property="twitter:site" content="@TrezyCodes" />
          <meta property="twitter:creator" content="@TrezyCodes" />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </NextHead>

        <main className={classnames('page', className, title.toLowerCase().replace(/\s/gu, '-').replace(/[^a-z0-9-]/gu, ''))}>
          {children}

          <ContentInfo />
        </main>
      </>
    )
  }


  get displayTitle () {
    const {
      displayTitle,
      title,
    } = this.props

    if (typeof displayTitle === 'function') {
      return displayTitle(title)
    }

    return (<h1>{displayTitle}</h1>)
  }

  static defaultProps = {
    className: '',
    description: 'Oh no! This page doesn\'t have a description! 😬',
    displayTitle: title => (<h1>{title}</h1>),
  }

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf([
        PropTypes.element,
        PropTypes.node,
      ]),
      PropTypes.element,
      PropTypes.node,
    ]).isRequired,
    className: PropTypes.string,
    description: PropTypes.string,
    displayTitle: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
    ]),
    title: PropTypes.string.isRequired,
  }
}





export default PageWrapper
