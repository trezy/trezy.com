// Module imports
import React, {
  createRef,
  useEffect,
} from 'react'
import Prism from 'prismjs'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'





// Local imports
import config from '../helpers/reactMarkdownConfig'





const MarkdownRenderer = props => {
  const { source } = props
  const markdownWrapperRef = createRef(null)
  useEffect(() => {
    Prism.highlightAllUnder(markdownWrapperRef.current)
  }, [source])

  return (
    <div ref={markdownWrapperRef}>
      <ReactMarkdown
        className="line-numbers"
        {...config}
        {...props} />
    </div>
  )
}

MarkdownRenderer.propTypes = {
  source: PropTypes.string.isRequired,
}





export default MarkdownRenderer
