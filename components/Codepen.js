// Module imports
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'





const Codepen = props => {
  const {
    children,
    defaultTabs,
    height,
    id,
  } = props

  return (
    <div>
      <Head>
        <script
          async
          key="codepen-embed"
          src="https://static.codepen.io/assets/embed/ei.js" />
      </Head>

      <p
        className="codepen"
        data-height={height}
        data-theme-id="2296"
        data-default-tab={defaultTabs.join(',')}
        data-slug-hash={id} />

      {children}
    </div>
  )
}

Codepen.defaultProps = {
  children: null,
  defaultTabs: ['result'],
  height: 300,
}

Codepen.propTypes = {
  children: PropTypes.node,
  defaultTabs: PropTypes.array,
  height: PropTypes.number,
  id: PropTypes.string.isRequired,
}





export default Codepen
