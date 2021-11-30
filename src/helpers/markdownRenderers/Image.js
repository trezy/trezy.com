// Module imports
import PropTypes from 'prop-types'





export function Image(props) {
	const {
		alt,
		node,
		src,
		title,
	} = props
	const {
		caption,
		className,
		figure,
		id,
	} = node.data || {}

	const passableProps = {
		...props,
		className,
		id,
	}
	delete passableProps.node

	if (!alt && !title) {
		console.error('Images must have an alt and/or title attribute.')
	}

	if (figure) {
		return (
			<figure>
				{Boolean(caption) && (
					<figcaption>{caption}</figcaption>
				)}

				<img
					{...passableProps}
					alt={alt || title}
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
