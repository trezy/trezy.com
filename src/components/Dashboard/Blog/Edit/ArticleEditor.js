// Module imports
import React, {
	useCallback,
	useEffect,
	useState,
} from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'





// Component imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useArticle } from 'contexts/ArticleContext'
import { useAuth } from 'contexts/AuthContext'
import Button from 'components/Button'
import Input from 'components/Input'
import MarkdownEditor from 'components/MarkdownEditor'
import PageWrapper from 'components/PageWrapper'
import RequireAuthentication from 'components/RequireAuthentication'





export function ArticleEditor(props) {
	const { id } = props
	const {
		claims,
		user,
	} = useAuth()
	const {
		article: articleFromContext,
		isLoadingArticle,
		saveArticle,
	} = useArticle()
	const router = useRouter()

	const article = articleFromContext

	const [body, setBody] = useState(article?.body || '')
	const [previewMode, setPreviewMode] = useState(false)
	const [subtitle, setSubtitle] = useState(article?.subtitle || '')
	const [synopsis, setSynopsis] = useState(article?.synopsis || '')
	const [isUpdating, setIsUpdating] = useState(false)
	const [title, setTitle] = useState(article?.title)

	const handleSubmit = useCallback(async event => {
		event.preventDefault()
		setIsUpdating(true)

		const shouldPublish = event.target.value === 'publish'

		const serializedArticle = await saveArticle({
			body,
			subtitle,
			synopsis,
			title,
		}, shouldPublish)

		if (!id || (id === 'new')) {
			router.replace(`/dashboard/blog/edit/${serializedArticle.id}`)
		}

		setIsUpdating(false)
	}, [
		body,
		id,
		setIsUpdating,
		subtitle,
		synopsis,
		title,
	])

	const handlePublish = useCallback(event => {
		event.preventDefault()
		handleSubmit(event)
	}, [handleSubmit])

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
		if (!isLoadingArticle && article) {
			setBody(article.body)
			setSynopsis(article.synopsis)
			setSubtitle(article.subtitle)
			setTitle(article.title)
		}
	}, [
		article,
		isLoadingArticle,
		setBody,
		setSynopsis,
		setSubtitle,
		setTitle,
	])

	const canPublish = claims?.['actions.article.publish']

	return (
		<PageWrapper
			showHeader={false}
			title="Editing Article">
			<RequireAuthentication>
				<form onSubmit={handleSubmit}>
					<header className="block no-top-margin">
						<h2>
							<Input
								disabled={isLoadingArticle || isUpdating}
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
									disabled={isLoadingArticle || isUpdating}
									label="Subtitle"
									onChange={handleSubtitleChange}
									placeholder="Subtitle"
									type="text"
									value={subtitle} />
							</div>

							<div className="field">
								<MarkdownEditor
									aria-label="Synopsis"
									disabled={isLoadingArticle || isUpdating}
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
								disabled={isLoadingArticle || isUpdating}
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
								disabled={isLoadingArticle || isUpdating}
								onClick={handlePreviewMode}>
								Preview
							</Button>

							<Button
								className="primary"
								disabled={isLoadingArticle || isUpdating}
								type="submit"
								value="save">
								Save
							</Button>

							{(article?.isDraft && canPublish) && (
								<Button
									className="primary"
									disabled={isLoadingArticle || isUpdating}
									onClick={handlePublish}
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
