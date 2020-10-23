// Module imports
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'





const ArticleHeader = ({ slug, subtitle, summarize, title }) => (
  <header>
    {summarize && (
      <h3>
        <Link
          as={`/blog/${slug}`}
          href="/blog/[slug]">
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
  subtitle: '',
  summarize: false,
}

ArticleHeader.propTypes = {
  slug: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  summarize: PropTypes.bool,
  title: PropTypes.string.isRequired,
}





export default ArticleHeader
