// Module imports
import React, {
  useEffect,
} from 'react'
import Prism from 'prismjs'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'





// Local imports
import config from '../helpers/reactMarkdownConfig'





const MarkdownRenderer = props => {
  const { source } = props
  useEffect(() => {
    setTimeout(() => Prism.highlightAll(), 0)
  }, [source])

  return (
    <ReactMarkdown
      className="line-numbers"
      {...config}
      {...props} />
  )
}

MarkdownRenderer.propTypes = {
  source: PropTypes.string.isRequired,
}





export default MarkdownRenderer
