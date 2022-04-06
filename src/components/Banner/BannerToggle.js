// Module imports
import {
	faBars,
	faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





// Local imports
import { Button } from 'components/Button'
import { useBanner } from 'contexts/BannerContext'





function BannerToggle() {
	const {
		bannerIsOpen,
		toggleBanner,
	} = useBanner()

	return (
		<Button
			aria-label={`${bannerIsOpen ? 'Collapse' : 'Expand'} main navigation`}
			aria-pressed={bannerIsOpen}
			className="iconic primary"
			id="banner-control"
			onClick={toggleBanner}>
			<FontAwesomeIcon
				data-animate
				data-animation={`fade-${bannerIsOpen ? 'out' : 'in'}`}
				data-animation-duration="0.2s"
				fixedWidth
				icon={faBars} />

			<FontAwesomeIcon
				data-animate
				data-animation={`fade-${bannerIsOpen ? 'in' : 'out'}`}
				data-animation-duration="0.2s"
				fixedWidth
				icon={faTimes} />
		</Button>
	)
}

export { BannerToggle }
