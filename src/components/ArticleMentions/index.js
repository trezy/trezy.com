'use client'

// Module imports
import {
	useEffect,
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'

// Local imports
import { CollectionPreview } from './CollectionPreview.js'
import { fetchCollectionPreviews, getHighlightId } from './api.js'
import { getArticleURL } from 'helpers/getArticleURL.js'

function isMarginExtensionInstalled() {
	if (typeof document === 'undefined') return false

	return !!(
		document.querySelector('[data-margin]') ||
		document.querySelector('[data-margin-extension]') ||
		document.getElementById('margin-root')
	)
}

function highlightTextInDOM(container, highlight) {
	const { highlightText: text, color, author, annotation } = highlight
	if (!text || text.length < 10) return

	const walker = document.createTreeWalker(
		container,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode: (node) => {
				const parent = node.parentElement

				if (parent?.tagName === 'SCRIPT' || parent?.tagName === 'STYLE' || parent?.tagName === 'MARK') {
					return NodeFilter.FILTER_REJECT
				}

				return NodeFilter.FILTER_ACCEPT
			},
		},
	)

	let node = walker.nextNode()

	while (node) {
		const idx = node.textContent.indexOf(text)

		if (idx !== -1) {
			const range = document.createRange()
			range.setStart(node, idx)
			range.setEnd(node, idx + text.length)

			const mark = document.createElement('mark')
			mark.className = 'margin-inline-highlight'
			mark.id = getHighlightId(text)

			if (color) {
				mark.style.backgroundColor = `${color}26`
				mark.style.borderBottomColor = `${color}80`
			}

			try {
				range.surroundContents(mark)
			} catch {
				// skip highlights that span multiple DOM nodes
				return
			}

			if (author?.avatar) {
				const img = document.createElement('img')
				img.className = 'margin-inline-avatar'
				img.src = author.avatar
				img.alt = author.displayName || author.handle || ''
				mark.parentNode.insertBefore(img, mark)
			}

			if (annotation) {
				const note = document.createElement('span')
				note.className = 'margin-inline-note'
				note.textContent = annotation
				mark.after(note)
			}

			return
		}

		node = walker.nextNode()
	}
}

export function ArticleMentions({ article }) {
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	const articleURL = useMemo(() => {
		let origin = process.env.NEXT_PUBLIC_URL

		if (typeof location !== 'undefined') {
			origin = location.origin
		}

		return new URL(getArticleURL(article), origin).toString()
	}, [article])

	useEffect(() => {
		fetchCollectionPreviews(articleURL)
			.then(setData)
			.catch(() => setData(null))
			.finally(() => setIsLoading(false))
	}, [articleURL])

	useEffect(() => {
		if (!data?.groups) return
		if (isMarginExtensionInstalled()) return

		const marginGroup = data.groups.find(g => g.id === 'margin')
		if (!marginGroup || marginGroup.items.length === 0) return

		const articleEl = document.querySelector('article .container')
		if (!articleEl) return

		for (const highlight of marginGroup.items) {
			highlightTextInDOM(articleEl, highlight)
		}

		return () => {
			document.querySelectorAll('.margin-inline-avatar, .margin-inline-note').forEach(el => el.remove())

			document.querySelectorAll('mark.margin-inline-highlight').forEach(mark => {
				const parent = mark.parentNode
				parent.replaceChild(document.createTextNode(mark.textContent), mark)
				parent.normalize()
			})
		}
	}, [data])

	if (isLoading || !data?.groups?.length) return null

	return (
		<aside className={'article-mentions'}>
			<h3>{'Mentions across the ATmosphere'}</h3>

			<div className={'collection-grid'}>
				{data.groups.map(group => (
					<CollectionPreview
						key={group.id}
						articleSlug={article.slug}
						group={group} />
				))}
			</div>
		</aside>
	)
}

ArticleMentions.propTypes = {
	article: PropTypes.object.isRequired,
}
