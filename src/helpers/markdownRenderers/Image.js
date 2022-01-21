// Module imports
import { useMemo } from 'react'
import NextImage from 'next/image'
import PropTypes from 'prop-types'





export function Image(props) {
	const {
		alt,
		node,
		title,
	} = props
	const {
		caption,
		className,
		figure,
		id,
	} = node.data || {}
	const src = useMemo(() => {
		return props.src.replace(/^\/\//, 'https://')
	}, [props.src])

	const passableProps = useMemo(() => {
		const parsedProps = {
			...props,
			className,
			id,
		}

		delete parsedProps.node

		return parsedProps
	}, [
		className,
		id,
		props,
	])

	if (!alt && !title) {
		console.error('Images must have an alt and/or title attribute.')
	}

	if (figure) {
		return (
			<figure>
				{Boolean(caption) && (
					<figcaption>{caption}</figcaption>
				)}

				<NextImage
					{...passableProps}
					alt={alt || title}
					src={src}
					title={title || alt} />
			</figure>
		)
	}

	return (
		<img
			{...passableProps}
			alt={alt || title}
			title={title || alt} />
	)
}

Image.defaultProps = {
	alt: null,
	node: null,
	title: null,
}

Image.propTypes = {
	alt: PropTypes.string,
	node: PropTypes.object,
	src: PropTypes.string.isRequired,
	title: PropTypes.string,
}
