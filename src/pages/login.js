// Module imports
import React, {
	useEffect,
} from 'react'
import {
	isEmpty,
	isLoaded,
	useFirebase,
} from 'react-redux-firebase'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'





// Component imports
import Button from 'components/Button'
import PageWrapper from 'components/PageWrapper'





// Local variables
let redirectStarted = false





function Login(props) {
	const { destination } = props
	const Router = useRouter()

	const firebase = useFirebase()
	const auth = useSelector(state => state.firebase.auth)

	useEffect(() => {
		if (isLoaded(auth) && !isEmpty(auth)) {
			Router.replace(destination || '/')
		}
	}, [auth])

	return (
		<PageWrapper title="Login">
			<section className="block hero">
				<menu
					className="login-providers"
					type="toolbar">
					<Button
						className="primary"
						onClick={() => firebase.login({
							provider: 'google',
							type: 'popup',
						})}>
						Sign in with Google
					</Button>

					{/* <Button
						className="primary"
						onClick={() => firebase.login({
							provider: 'github',
							type: 'popup',
						})}>
						Sign in with Github
					</Button> */}

					<Button
						className="primary"
						onClick={() => firebase.login({
							provider: 'twitter',
							type: 'popup',
						})}>
						Sign in with Twitter
					</Button>
				</menu>
			</section>
		</PageWrapper>
	)
}

Login.getInitialProps = ({ query }) => ({
	destination: query.destination,
})

Login.defaultProps = {
	destination: '',
}

Login.propTypes = {
	destination: PropTypes.string,
}





export default Login
