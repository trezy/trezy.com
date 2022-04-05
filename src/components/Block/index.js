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
		headerImageHeight,
		headerImageSource,
		headerImageWidth,
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
					height={headerImageHeight}
					layout="fill"
					objectFit="cover"
					src={headerImageSource}
					width={headerImageWidth} />
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
	headerImageHeight: 0,
	headerImageSource: '',
	headerImageWidth: 0,
}

Block.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	elementType: PropTypes.string,
	headerImageAlt: PropTypes.string,
	headerImageHeight: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	headerImageSource: PropTypes.string,
	headerImageWidth: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
}
