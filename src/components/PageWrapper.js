/* eslint-disable react/no-multi-comp */

// Module imports
import React, {
	useEffect,
} from 'react'
import {
	isEmpty,
	isLoaded,
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import classnames from 'classnames'
import Head from 'next/head'
import PropTypes from 'prop-types'





// Local imports
import { useAnalytics } from 'hooks/useAnalytics'
import Breadcrumbs from 'components/Breadcrumbs'
import ContentInfo from 'components/ContentInfo'





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
	const auth = useSelector(state => state.firebase.auth)
	const analytics = useAnalytics()

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

	useEffect(() => {
		if (isLoaded(auth) && !isEmpty(auth)) {
			analytics.config({
				option: 'GA_MEASUREMENT_ID',
				user_id: auth.uid, /* eslint-disable-line camelcase */
			})
		}
	}, [auth])

	return (
		<>
			<Head>
				<title>{title} | Trezy.com</title>
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

			<main className={classnames('page', className, title.toLowerCase().replace(/\s/gu, '-').replace(/[^a-z0-9-]/gu, ''))}>
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
			</main>
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
