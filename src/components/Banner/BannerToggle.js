// Local imports
import { Button } from 'components/Button'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
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
				icon="bars" />

			<FontAwesomeIcon
				data-animate
				data-animation={`fade-${bannerIsOpen ? 'in' : 'out'}`}
				data-animation-duration="0.2s"
				fixedWidth
				icon="times" />
		</Button>
	)
}

export { BannerToggle }
