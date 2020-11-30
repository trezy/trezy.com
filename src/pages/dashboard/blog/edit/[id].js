// Module imports
import React, {
	useCallback,
	useEffect,
	useState,
} from 'react'
import {
	isLoaded,
	useFirestoreConnect,
} from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'





// Component imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import articleDefaults from 'models/article'
import Button from 'components/Button'
import createSlugFromTitleString from 'helpers/createSlugFromTitleString'
import createTitleStringFromArticle from 'helpers/createTitleStringFromArticle'
import Input from 'components/Input'
import MarkdownEditor from 'components/MarkdownEditor'
import PageWrapper from 'components/PageWrapper'
import RequireAuthentication from 'components/RequireAuthentication'
import useClaimsSelector from 'store/selectors/useClaimsSelector'
import useCurrentUserIDSelector from 'store/selectors/useCurrentUserIDSelector'





function BlogEditor({ id }) {
	const firestore = getFirestore()
	const Router = useRouter()
	const connections = []

	if (id !== 'new') {
		connections.push({
			collection: 'articles',
			doc: id,
		})
	}

	useFirestoreConnect(connections)

	const article = useSelector(state => state.firestore.data.articles?.[id]) || { ...articleDefaults }
	const claims = useClaimsSelector()
	const currentUserID = useCurrentUserIDSelector()
	const { isDraft } = article

	const [body, setBody] = useState(article.body || '')
	const [previewMode, setPreviewMode] = useState(false)
	const [subtitle, setSubtitle] = useState(article.subtitle || '')
	const [synopsis, setSynopsis] = useState(article.synopsis || '')
	const [isUpdating, setIsUpdating] = useState(false)
	const [title, setTitle] = useState(article.title)

	const handleSubmit = useCallback(async event => {
		event.preventDefault()
		setIsUpdating(true)

		const shouldPublish = event.target.value === 'publish'

		const now = firestore.Timestamp.fromDate(moment().toDate())
		const serializedArticle = {
			...article,
			authorID: article.authorID || currentUserID,
			body,
			subtitle,
			synopsis,
			title,
		}

		if (article.createdAt) {
			serializedArticle.createdAt = firestore.Timestamp.fromMillis(article.createdAt.seconds * 1000)
		}

		serializedArticle.updatedAt = now
		serializedArticle.slug = createSlugFromTitleString(createTitleStringFromArticle(serializedArticle))

		if (article.publishedAt) {
			serializedArticle.publishedAt = firestore.Timestamp.fromMillis(article.publishedAt.seconds * 1000)
		}

		if (shouldPublish) {
			serializedArticle.isDraft = false
			serializedArticle.publishedAt = now
		}

		if (id === 'new') {
			serializedArticle.createdAt = now
			serializedArticle.id = uuid()
			serializedArticle.oldSlugs = []
		}

		await firestore.set({ collection: 'articles', doc: serializedArticle.id }, serializedArticle)

		if (id === 'new') {
			const href = '/dashboard/blog/edit/[id]'
			const as = `/dashboard/blog/edit/${serializedArticle.id}`
			const options = { shallow: true }

			Router.replace(href, as, options)
		}

		setIsUpdating(false)
	}, [
		article,
		body,
		id,
		setIsUpdating,
		subtitle,
		synopsis,
		title,
	])

	const handleBodyChange = useCallback(({ target: { value } }) => {
		setBody(value)
	}, [setBody])
	const handlePreviewMode = useCallback(() => {
		setPreviewMode(previousValue => !previousValue)
	}, [setPreviewMode])
	const handleSubtitleChange = useCallback(({ target: { value } }) => {
		setSubtitle(value)
	}, [setSubtitle])
	const handleSynopsisChange = useCallback(({ target: { value } }) => {
		setSynopsis(value)
	}, [setSynopsis])
	const handleTitleChange = useCallback(({ target: { value } }) => {
		setTitle(value)
	}, [setTitle])

	useEffect(() => {
		const bodyHasChanged = body && (body !== article.body)
		const synopsisHasChanged = synopsis && (synopsis !== article.synopsis)
		const subtitleHasChanged = subtitle && (subtitle !== article.subtitle)
		const titleHasChanged = title && (title !== article.title)

		if (!bodyHasChanged && !subtitleHasChanged && !synopsisHasChanged && !titleHasChanged) {
			setBody(article.body)
			setSynopsis(article.synopsis)
			setSubtitle(article.subtitle)
			setTitle(article.title)
		}
	}, [
		article,
		body,
		setBody,
		setSynopsis,
		setSubtitle,
		setTitle,
		subtitle,
		synopsis,
		title,
	])

	const isLoading = !isLoaded(article)
	const canPublish = claims['actions.article.publish']

	return (
		<PageWrapper
			showHeader={false}
			title={`Editing Article: ${title}`}>
			<RequireAuthentication>
				<form onSubmit={handleSubmit}>
					<header className="block no-top-margin">
						<h2>
							<Input
								disabled={isLoading || isUpdating}
								label="Title"
								onChange={handleTitleChange}
								placeholder="Title"
								type="text"
								value={title} />
						</h2>

						<details>
							<summary>Article Details</summary>

							<div className="field">
								<Input
									aria-label="Subtitle"
									disabled={isLoading || isUpdating}
									label="Subtitle"
									onChange={handleSubtitleChange}
									placeholder="Subtitle"
									type="text"
									value={subtitle} />
							</div>

							<div className="field">
								<MarkdownEditor
									aria-label="Synopsis"
									disabled={isLoading || isUpdating}
									label="Synopsis"
									onChange={handleSynopsisChange}
									placeholder="Synopsis"
									previewMode={previewMode}
									value={synopsis} />
							</div>
						</details>
					</header>

					<section className="block">
						<div className="field">
							<MarkdownEditor
								aria-label="Body"
								disabled={isLoading || isUpdating}
								label="Body"
								onChange={handleBodyChange}
								placeholder="Body"
								previewMode={previewMode}
								value={body} />
						</div>

						<menu
							className="floaty-menu floaty-bottom"
							type="toolbar">
							<Button
								disabled={isLoading || isUpdating}
								onClick={handlePreviewMode}>
								Preview
							</Button>

							<Button
								className="primary"
								disabled={isLoading || isUpdating}
								type="submit"
								value="save">
								Save
							</Button>

							{(isDraft && canPublish) && (
								<Button
									className="primary"
									disabled={isLoading || isUpdating}
									type="submit"
									value="publish">
									Publish
								</Button>
							)}

							{isUpdating && (
								<>
									<FontAwesomeIcon
										icon="spinner"
										pulse />
									Updating...
								</>
							)}
						</menu>
					</section>
				</form>
			</RequireAuthentication>
		</PageWrapper>
	)
}

BlogEditor.getInitialProps = ({ query: { id } }) => ({ id })

BlogEditor.propTypes = {
	id: PropTypes.string.isRequired,
}





export default BlogEditor
