// Module imports
import {
	Children,
	createElement,
} from 'react'
import classnames from 'classnames'
import Image from 'next/image'
import PropTypes from 'prop-types'





export function Block(props) {
	const {
		children,
		className,
		elementType,
		headerImageAlt,
		headerImageSource,
	} = props

	const dataAttributes = Object
		.entries(props)
		.reduce((accumulator, [key, value]) => {
			if (key.startsWith('data-')) {
				accumulator[key] = value
			}

			return accumulator
		}, {})

	let headerImage = null

	if (headerImageSource) {
		headerImage = (
			<div
				key="header-image"
				className="block-header-image">
				<Image
					alt={headerImageAlt}
					layout="fill"
					objectFit="cover"
					priority
					src={headerImageSource} />
			</div>
		)
	}

	return createElement(elementType, {
		...dataAttributes,
		className: classnames('block', className),
	}, [
		headerImage,
		...Children.toArray(children),
	])
}

Block.defaultProps = {
	children: null,
	className: '',
	elementType: 'div',
	headerImageAlt: '',
	headerImageSource: '',
}

Block.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	elementType: PropTypes.string,
	headerImageAlt: PropTypes.string,
	headerImageSource: PropTypes.string,
}
