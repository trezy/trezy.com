// Local imports
import {
	motion,
	useReducedMotion,
} from 'framer-motion'
import { ApplicationNav } from 'components/ApplicationNav'
import { BannerToggle } from 'components/Banner/BannerToggle'
import { SocialNav } from 'components/SocialNav'
import { useBanner } from 'contexts/BannerContext'
import { useAuth } from 'contexts/AuthContext'





function Banner() {
	const { user } = useAuth()
	const {
		bannerIsOpen,
		bannerIsTogglable,
		closeBanner,
		toggleBanner,
	} = useBanner()
	const shouldReduceMotion = useReducedMotion()

	const variants = {
		closed: {
			transition: {
				duration: shouldReduceMotion ? 0 : 0.2,
			},
			x: 'calc(-100% - var(--gutter))',
		},
		open: {
			transition: {
				duration: shouldReduceMotion ? 0 : 0.2,
			},
			x: 0,
		},
	}

	return (
		<motion.header
			animate={bannerIsOpen ? 'open' : 'closed'}
			aria-expanded={bannerIsOpen}
			hidden={bannerIsOpen}
			role="banner"
			variants={variants}>
			<h1 className="brand">&lt;trezy-who/&gt;</h1>

			{bannerIsTogglable && (
				<BannerToggle />
			)}

			<ApplicationNav />

			<SocialNav isOpen={bannerIsOpen} />
		</motion.header>
	)
}





export default Banner
