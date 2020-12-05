// Module imports
import PropTypes from 'prop-types'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import Button from 'components/Button'





function BannerToggle(props) {
	const {
		isOpen,
		onClick,
	} = props

	return (
		<Button
			aria-label={`${isOpen ? 'Collapse' : 'Expand'} main navigation`}
			aria-pressed={isOpen}
			className="button iconic primary"
			id="banner-control"
			onClick={onClick}>
			<FontAwesomeIcon
				data-animate
				data-animation={`fade-${isOpen ? 'out' : 'in'}`}
				data-animation-duration="0.2s"
				fixedWidth
				icon="bars" />

			<FontAwesomeIcon
				data-animate
				data-animation={`fade-${isOpen ? 'in' : 'out'}`}
				data-animation-duration="0.2s"
				fixedWidth
				icon="times" />
		</Button>
	)
}

BannerToggle.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
}

export { BannerToggle }
