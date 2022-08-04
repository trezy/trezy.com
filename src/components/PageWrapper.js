// Module imports
import {
	motion,
	useReducedMotion,
} from 'framer-motion'
import { useEffect } from 'react'
import classnames from 'classnames'
import Head from 'next/head'
import PropTypes from 'prop-types'





// Local imports
// import { useAckee } from 'hooks/useAckee.js'
import { useBanner } from 'contexts/BannerContext.js'
import Breadcrumbs from 'components/Breadcrumbs.js'
import { ContentInfo } from 'components/ContentInfo.js'





// Component constants
const MAX_TITLE_LENGTH = 50
const MAX_DESCR_LENGTH = 300





function PageWrapper(props) {
	const {
		breadcrumbs,
		children,
		className,
		description,
		showHeader,
		title,
	} = props
	const shouldReduceMotion = useReducedMotion()
	const {
		bannerIsOpen,
		bannerIsTogglable,
	} = useBanner()

	// useAckee()

	const variants = {
		bannerIsClosed: {
			transition: {
				duration: shouldReduceMotion ? 0 : 0.2,
			},
			opacity: 1,
			originX: 'right',
			originY: 'top',
			scale: 1,
			x: 0,
			y: 0,
		},
		bannerIsOpen: {
			transition: {
				duration: shouldReduceMotion ? 0 : 0.2,
			},
			opacity: 1,
			originX: 'right',
			originY: 'top',
			scale: 0.8,
			x: 0,
			y: '20vh',
		},
		exit: {
			transition: {
				duration: shouldReduceMotion ? 0 : 0.5,
			},
			opacity: 0,
			scale: 1,
			x: 0,
			y: '200vh',
		},
		initial: {
			transition: {
				duration: shouldReduceMotion ? 0 : 0.2,
			},
			opacity: 0,
			originX: '50vw',
			originY: '50vh',
			scale: 1,
			x: '100%',
			y: 0,
		},
	}

	let animation = null

	if (bannerIsOpen && bannerIsTogglable) {
		animation = 'bannerIsOpen'
	} else {
		animation = 'bannerIsClosed'
	}

	useEffect(() => {
		/* eslint-disable no-console */
		if (title.length > MAX_TITLE_LENGTH) {
			console.warn(`Page titles should be fewer than 60 characters, preferably closer to 50. This page's title is ${title.length} characters.`)
		}

		if (description.length > MAX_DESCR_LENGTH) {
			console.error(`Page description is too long! The description should be 50-300 characters long, but this page's description is ${description.length} characters.`)
		}

		if (description.indexOf('"') !== -1) {
			console.error('Page descriptions shouldn\'t contain double quotes.')
		}
		/* eslint-enable no-console */
	}, [
		description,
		title,
	])

	return (
		<>
			<Head>
				<title>{`${title} | Trezy.com`}</title>
				<meta name="description" content={description} />
				<meta property="og:description" content={description} />
				<meta property="og:title" content={title} />
				<meta property="og:type" content="website" />
				<meta property="twitter:card" content="summary" />
				<meta property="twitter:site" content="@TrezyCodes" />
				<meta property="twitter:creator" content="@TrezyCodes" />
				<meta property="twitter:title" content={title} />
				<meta property="twitter:description" content={description} />
			</Head>

			<motion.main
				animate={animation}
				initial={variants.initial}
				exit={variants.exit}
				className={classnames('page', className, title.toLowerCase().replace(/\s/gu, '-').replace(/[^a-z0-9-]/gu, ''))}
				key={title}
				variants={variants}>
				{showHeader && (
					<header className="block">
						<h2>{title}</h2>

						{Boolean(breadcrumbs) && (
							<Breadcrumbs crumbs={breadcrumbs} />
						)}
					</header>
				)}

				{children}

				<ContentInfo />
			</motion.main>
		</>
	)
}

PageWrapper.defaultProps = {
	breadcrumbs: null,
	className: '',
	description: 'Oh no! This page doesn\'t have a description! 😬',
	displayTitle: title => (<h1>{title}</h1>),
	showHeader: true,
}

PageWrapper.propTypes = {
	breadcrumbs: PropTypes.array,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	description: PropTypes.string,
	displayTitle: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	showHeader: PropTypes.bool,
	title: PropTypes.string.isRequired,
}





export default PageWrapper
