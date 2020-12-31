// Module imports
import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { useRouter } from 'next/router'
import classnames from 'classnames'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useArticle } from 'contexts/ArticleContext'
import { useAuth } from 'contexts/AuthContext'
import Button from 'components/Button'
import MarkdownEditor from 'components/MarkdownEditor'





// Local constants
const PUBLISHED_MESSAGE_TIMEOUT = 5000





export function ResponseForm() {
	const router = useRouter()
	const formElement = useRef(null)
	const inputElement = useRef(null)
	const { user } = useAuth()
	const { publishResponse } = useArticle()
	const [body, setBody] = useState('')
	const [bodyHasChanged, setBodyHasChanged] = useState(false)
	const [isPublishing, setIsPublishing] = useState(false)
	const [isPublished, setIsPublished] = useState(false)
	const [previewMode, setPreviewMode] = useState(false)

	const handleChange = useCallback(({ target: { value } }) => {
		if (!bodyHasChanged) {
			setBodyHasChanged(true)
		}

		setBody(value)
	}, [
		setBodyHasChanged,
		setBody,
	])

	const handleFormClick = useCallback(({ target }) => {
		if (formElement.current.contains(target)) {
			inputElement.current.focus()
		}
	}, [])

	const handlePreviewModeClick = useCallback(() => {
		setPreviewMode(previousValue => !previousValue)
	}, [setPreviewMode])

	const handleSubmit = useCallback(async event => {
		event.preventDefault()

		setIsPublishing(true)

		try {
			await publishResponse(body)
			setIsPublished(true)
		} catch (error) {
			console.error(error)
		}

		setIsPublishing(false)
	}, [
		body,
		setIsPublished,
		setIsPublishing,
	])

	useEffect(() => {
		if (isPublished) {
			setBody('')
			setBodyHasChanged(false)
			setTimeout(() => setIsPublished(false), PUBLISHED_MESSAGE_TIMEOUT)
		}
	}, [
		isPublished,
		setBody,
		setBodyHasChanged,
		setIsPublished,
	])

	return (
		<>
			{!user && (
				<div className="response-form">
					<menu type="toolbar">
						<span>Login to leave a response: </span>

						<a
							href={`/login?destination=${router.asPath}`}
							className="button primary">
							<span>Login</span>
						</a>
					</menu>
				</div>
			)}

			{Boolean(user) && (
				<>
					{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
					<form
						className="response-form"
						onClick={handleFormClick}
						onSubmit={handleSubmit}
						ref={formElement}>

						<fieldset>
							<MarkdownEditor
								disabled={isPublishing || isPublished}
								onChange={handleChange}
								previewMode={previewMode}
								placeholder="Write a response..."
								ref={inputElement}
								value={body} />
						</fieldset>

						<footer>
							<small>
								<FontAwesomeIcon
									fixedWidth
									icon={['fab', 'markdown']} />
								{' '}Markdown supported
							</small>

							<menu
								className={classnames({
									'pointer-events-off': !body,
								})}
								data-animate
								data-animation={classnames({
									'fade-out-to-top-small': bodyHasChanged && !body,
									'fade-in-from-top-small': !bodyHasChanged || body,
								})}
								data-animation-duration="0.5s"
								data-animation-play-state={classnames({
									running: bodyHasChanged,
									paused: !bodyHasChanged,
								})}
								type="toolbar">
								<Button onClick={handlePreviewModeClick}>
									Preview
								</Button>

								<Button
									className="primary"
									disabled={!body || isPublishing || isPublished}
									type="submit">
									Publish
								</Button>
							</menu>
						</footer>

						{isPublished && (
							<div
								className="published-message"
								data-animate>
								<div>Published!</div>
							</div>
						)}
					</form>
				</>
			)}
		</>
	)
}
