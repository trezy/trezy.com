// Local imports
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

	return (
		<header
			aria-expanded={bannerIsOpen}
			hidden={bannerIsOpen}
			role="banner">
			<h1 className="brand">&lt;trezy-who/&gt;</h1>

			{bannerIsTogglable && (
				<BannerToggle />
			)}

			<ApplicationNav />

			<SocialNav isOpen={bannerIsOpen} />
		</header>
	)
}





export default Banner
