import {
	useCallback,
	useState,
} from 'react'
import PropTypes from 'prop-types'
import { Button } from 'components/Button'
import Input from 'components/Input'
import { ExternalLink } from 'components/ExternalLink.js'
import { useATProto } from 'contexts/ATProtoContext.js'

export function ATProtoLoginModal(props) {
	const {
		onClose,
		onLoginStart,
	} = props

	const { login } = useATProto()
	const [handle, setHandle] = useState('')
	const [isLoggingIn, setIsLoggingIn] = useState(false)
	const [error, setError] = useState(null)
	const [isInfoOpen, setIsInfoOpen] = useState(false)

	const handleSubmit = useCallback(async (event) => {
		event.preventDefault()

		if (!handle.trim()) return

		setIsLoggingIn(true)
		setError(null)

		try {
			onLoginStart?.()
			await login(handle.trim())
		} catch (err) {
			setError('Failed to start login. Please check your handle and try again.')
			setIsLoggingIn(false)
		}
	}, [handle, login, onLoginStart])

	const handleInputChange = useCallback((event) => {
		setHandle(event.target.value)
	}, [])

	const handleBackdropClick = useCallback((event) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}, [onClose])

	const toggleInfo = useCallback(() => {
		setIsInfoOpen(prev => !prev)
	}, [])

	return (
		<div
			className="atproto-login-backdrop"
			role="dialog"
			aria-modal="true"
			onClick={handleBackdropClick}>
			<div className="atproto-login-card">
				<div className="card-header">
					<h3 className="card-title">{'Atmosphere'}</h3>
					<p className="card-description">{'Connect with your Atmosphere account'}</p>
				</div>

				<div className="card-content">
					<form onSubmit={handleSubmit}>
						<div className="field">
							<label>{'Handle'}</label>

							<Input
								id="atproto-handle"
								type="text"
								placeholder="user.bsky.social"
								prefix="@"
								value={handle}
								onChange={handleInputChange}
								disabled={isLoggingIn}
								required
								autoFocus />
						</div>

						{error && (
							<p className="form-error">{error}</p>
						)}

						<div className="field">
							<menu type="toolbar">
								<Button
									className="primary connect-button"
									type="submit"
									disabled={isLoggingIn || !handle.trim()}>
									{isLoggingIn ? 'Connecting...' : 'Connect'}
								</Button>
							</menu>
						</div>

						<div className="form-footer">
							<button
								type="button"
								className="info-toggle"
								onClick={toggleInfo}
								aria-expanded={isInfoOpen}>
								{'What is an Atmosphere account?'}
							</button>

							{isInfoOpen && (
								<p className="info-text">
									{'This site uses the '}
									<ExternalLink href="https://atproto.com">{'AT Protocol'}</ExternalLink>
									{' to power reactions, allowing you to own your data and use one account for all compatible applications. Once you create an account, you can use other apps like '}
									<ExternalLink href="https://bsky.app">{'Bluesky'}</ExternalLink>
									{' and '}
									<ExternalLink href="https://tangled.org">{'Tangled'}</ExternalLink>
									{' with the same account.'}
								</p>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

ATProtoLoginModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	onLoginStart: PropTypes.func,
}
