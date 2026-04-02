// Module imports
import { notFound } from 'next/navigation'

// Local imports
import { ArticleMeta } from 'components/ArticleMeta/index.js'
import { ArticleReactions } from 'components/ArticleReactions.js'
import { Block } from 'components/Block/index.js'
import { Container } from 'components/Container/Container.js'
import createTitleStringFromArticle from 'helpers/createTitleStringFromArticle.js'
import { getArticleData, mdxOptions } from 'helpers/getArticleAsStaticProps.js'
import { MDXRenderer } from 'components/MDXRenderer.js'
import { PageContent } from 'components/PageContent.js'
import * as Contentful from 'helpers/Contentful'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://trezy.codes'

export async function generateStaticParams() {
	const articles = await Contentful.getAllArticles()

	return articles.map((article) => ({
		slug: article.slug,
	}))
}

export async function generateMetadata({ params }) {
	const { slug } = await params
	const data = await getArticleData(slug)

	if (!data.article) {
		return {}
	}

	const article = data.article
	const articleTitle = createTitleStringFromArticle(article)
	const headerImageURL = article.headerImage?.fields?.file?.url?.replace(/^\/\//, 'https://')
	const ogImageParams = new URLSearchParams({ title: articleTitle })

	if (headerImageURL) {
		ogImageParams.set('image', headerImageURL)
	}

	const ogImage = `${SITE_URL}/api/og?${ogImageParams.toString()}`
	const ogImageAlt = article.headerImage?.fields?.description || articleTitle

	return {
		title: articleTitle,
		description: article.synopsis,
		openGraph: {
			title: articleTitle,
			description: article.synopsis,
			type: 'article',
			images: [{ url: ogImage, alt: ogImageAlt }],
		},
		twitter: {
			card: headerImageURL ? 'summary_large_image' : 'summary',
			site: '@TrezyCodes',
			creator: '@TrezyCodes',
			title: articleTitle,
			description: article.synopsis,
			images: ogImage ? [ogImage] : undefined,
		},
	}
}

export default async function ArticlePage({ params }) {
	const { slug } = await params
	const data = await getArticleData(slug)

	if (!data.article) {
		notFound()
	}

	const {
		article,
		body,
		changelogBody = null,
		dependencies = null,
	} = data

	const articleTitle = createTitleStringFromArticle(article)

	return (
		<PageContent
			showHeader={false}
			title={articleTitle}>
			<Block
				elementType={'header'}
				headerImageAlt={article.headerImage?.fields?.description}
				headerImageSource={article.headerImage?.fields?.file?.url?.replace(/^\/\//, 'https://')}>
				<Container>
					<h2 style={{ lineHeight: 1.5, marginBottom: 0 }}>{article.title}</h2>

					{Boolean(article.subtitle) && (
						<p
							style={{ 
								fontSize: '1.5em',
								marginTop: 0,
							}}>
							<strong>{article.subtitle}</strong>
						</p>
					)}

					{Boolean(article.synopsis) && (
						<p style={{ lineHeight: 1.5, opacity: 0.6 }}>{article.synopsis}</p>
					)}

					<ArticleMeta
						article={article}
						changelog={changelogBody ? (
							<MDXRenderer
								source={changelogBody}
								options={{ mdxOptions, blockJS: false }} />
						) : null}
						dependencies={dependencies} />
				</Container>
			</Block>

			<Block elementType={'article'}>
				<Container>
					<MDXRenderer
						source={body}
						options={{ mdxOptions, blockJS: false }} />

					<ArticleReactions article={article} />
				</Container>
			</Block>
		</PageContent>
	)
}
