// Module imports
import React from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Link } from '../routes'





const ArticleHeader = ({ id, subtitle, summarize, title }) => (
  <header>
    {summarize && (
      <h3>
        <Link
          params={{ id }}
          route="view article">
          <a>{title}</a>
        </Link>
      </h3>
    )}

    {!summarize && (
      <h2>{title}</h2>
    )}

    {subtitle && (
      <span className="subtitle">
        {subtitle}
      </span>
    )}
  </header>
)

ArticleHeader.defaultProps = {
  id: null,
  subtitle: '',
  summarize: false,
}

ArticleHeader.propTypes = {
  id: PropTypes.string,
  subtitle: PropTypes.string,
  summarize: PropTypes.bool,
  title: PropTypes.string.isRequired,
}





export default ArticleHeader
