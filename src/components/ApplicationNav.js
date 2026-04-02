// Module imports
import {
	faBook,
	faHome,
	faUser,
} from '@fortawesome/free-solid-svg-icons'

// Local imports
import {
	Nav,
	NavLink,
} from 'components/Nav'
import { useBanner } from 'contexts/BannerContext'

function ApplicationNav() {
	const { bannerIsOpen } = useBanner()

	return (
		<Nav isOpen={bannerIsOpen}>
			<NavLink
				href="/"
				icon={faHome}
				title="Home" />

			<NavLink
				href="/blog"
				icon={faBook}
				title="Blog" />

			<NavLink
				href="/about"
				icon={faUser}
				title="About" />
		</Nav>
	)
}

export { ApplicationNav }
