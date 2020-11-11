// Module imports
import PropTypes from 'prop-types'





function Employer(props) {
	const {
		children,
		name,
		url,
	} = props

	return (
		<section className="block">
			<header>
				<h3>
					<a href={url}>
						{name}
					</a>
				</h3>
			</header>

			<ol>
				{children}
			</ol>
		</section>
	)
}

Employer.propTypes = {
	children: PropTypes.node.isRequired,
	name: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
}

export default Employer
