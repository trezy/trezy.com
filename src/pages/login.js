// Module imports
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import {
	GoogleAuthProvider,
	TwitterAuthProvider,
	signInWithPopup,
} from 'firebase/auth'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'




// Component imports
import { Button } from 'components/Button'
import { useAuth } from 'contexts/AuthContext'
import { useFirebase } from 'hooks/useFirebase'
import PageWrapper from 'components/PageWrapper'




function Login(props) {
	const { destination = '' } = props
	const { auth } = useFirebase()
	const {
		isLoaded,
		user,
	} = useAuth()
	const Router = useRouter()
	const providers = useRef({
		google: new GoogleAuthProvider(),
		twitter: new TwitterAuthProvider(),
	})
	const [isLoggingIn, setIsLoggingIn] = useState(false)

	const handleLogin = useCallback(provider => {
		setIsLoggingIn(true)

		try {
			signInWithPopup(auth, provider)
		} catch (error) {
			setIsLoggingIn(false)
		}
	}, [auth])

	const handleGoogleLogin = useCallback(() => {
		handleLogin(providers.current.google)
	}, [handleLogin])
	const handleTwitterLogin = useCallback(() => {
		handleLogin(providers.current.twitter)
	}, [handleLogin])

	useEffect(() => {
		if (isLoaded && user) {
			Router.replace(destination || '/')
		}
	}, [
		isLoaded,
		user,
	])

	return (
		<PageWrapper title="Login">
			<section className="block hero">
				<menu
					className="login-providers"
					type="toolbar">
					<Button
						className="primary"
						disabled={isLoggingIn}
						onClick={handleGoogleLogin}>
						Sign in with Google
					</Button>

					<Button
						className="primary"
						disabled={isLoggingIn}
						onClick={handleTwitterLogin}>
						Sign in with Twitter
					</Button>
				</menu>
			</section>
		</PageWrapper>
	)
}

Login.propTypes = {
	destination: PropTypes.string,
}

export async function getServerSideProps(context) {
	const { destination } = context.query

	return {
		props: {
			destination: destination || null,
		},
	}
}




export default Login
