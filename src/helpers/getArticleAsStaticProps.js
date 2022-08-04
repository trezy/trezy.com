// Module imports
import behead from 'remark-behead'
import directive from 'remark-directive'
import gfm from 'remark-gfm'
import { serialize } from 'next-mdx-remote/serialize'
import squeezeParagraphs from 'remark-squeeze-paragraphs'





// Local imports
import * as Contentful from './Contentful.js'
import * as Twitter from './Twitter.js'





// Constants
const mdxOptions = {
	remarkPlugins: [
		[behead, { depth: 1 }],
		gfm,
		directive,
		squeezeParagraphs,
	],
	rehypePlugins: [],
}





function getReferencedTweets(tweetData, twitterResponse) {
	return tweetData.referenced_tweets?.map(referencedTweet => {
		const referencedTweetData = twitterResponse.includes.tweets.find(tweet => {
			return tweet.id === referencedTweet.id
		})

		if (referencedTweetData) {
			return parseTweet(referencedTweetData, twitterResponse, referencedTweet.type)
		}

		return null
	})
}

function getTweetAuthorData(tweetData, twitterResponse) {
	return twitterResponse.includes.users.find(twitterUser => {
		return twitterUser.id === tweetData.author_id
	})
}

function getTweetMedia(tweetData, twitterResponse) {
	if (!tweetData.attachments) {
		return []
	}

	return tweetData.attachments.media_keys.map(key => {
		const media = twitterResponse.includes.media
			.find(media => {
				return media.media_key === key
			})

		if (!media) {
			return null
		}

		return {
			altText: media.alt_text || null,
			height: media.height,
			previewURL: media.preview_image_url || media.url,
			type: media.type || null,
			url: media.url || null,
			variants: media.variants.map(variant => ({
				bitRate: variant.bit_rate || null,
				contentType: variant.content_type,
				url: variant.url,
			})),
			width: media.width,
		}
	})
}

function parseTweet(tweetData, twitterResponse, referenceType = null) {
	const parsedTweet = {
		author: getTweetAuthorData(tweetData, twitterResponse),
		body: tweetData.text,
		createdAt: tweetData.created_at,
		id: tweetData.id,
		likes: tweetData.public_metrics.like_count,
		media: getTweetMedia(tweetData, twitterResponse),
		referencedTweets: getReferencedTweets(tweetData, twitterResponse) || null,
		referenceType,
		replies: tweetData.public_metrics.reply_count,
		replyTo: tweetData.in_reply_to_user_id || null,
		retweets: tweetData.public_metrics.retweet_count,
		quoteRetweets: tweetData.public_metrics.quote_count,
	}

	if (tweetData.entities) {
		const entityKeys = [
			'annotations',
			'hashtags',
			'mentions',
			'urls',
		]

		parsedTweet.entities = entityKeys
			.reduce((accumulator, key) => {
				if (tweetData.entities[key]) {
					tweetData.entities[key].forEach(entity => {
						accumulator.push({
							displayURL: entity.display_url || null,
							isImage: Boolean(entity.media_key),
							end: entity.end,
							start: entity.start,
							type: key.replace(/s$/u, ''),
							url: entity.unwound_url || entity.expanded_url || null,
							username: entity.username || null,
						})
					})
				}

				return accumulator
			}, [])
			.sort((a, b) => {
				if (a.end < b.start) {
					return 1
				}

				if (a.end > b.start) {
					return -1
				}

				return 0
			})
	}

	return parsedTweet
}

export async function getArticleAsStaticProps(context) {
	const { slug } = context.params
	const props = {}

	const article = await Contentful.getArticle(slug, context.preview)

	if (article) {
		const scope = {}

		props.article = article

		const tweetIDs = Array
			.from(article.body.matchAll(/<Tweet id=("[0-9]+"|'[0-9]+'|\{"[0-9]+"\}|\{'[0-9]+'\})\s?\/>/gu	))
			.map(([, idString]) => idString.replace(/[^0-9]/gu, ''))

		if (tweetIDs.length) {
			const twitterResponse = await Twitter.getTweets(tweetIDs)

			scope.tweets = twitterResponse.data.reduce((accumulator, tweetData) => {
				const parsedTweet = parseTweet(tweetData, twitterResponse)
				accumulator[parsedTweet.id] = parsedTweet
				return accumulator
			}, {})
		}

		article.body = article.body
			.replace(/<Tweet id=("[0-9]+"|'[0-9]+'|\{"[0-9]+"\}|\{'[0-9]+'\})\s?\/>/gu, (_, idString) => {
				const tweetID = idString.replace(/[^0-9]/gu, '')
				return `<Tweet tweet={tweets['${tweetID}']} />`
			})

		props.dependencies = article.dependencies || null

		props.source = await serialize(article.body, {
			mdxOptions,
			scope,
		})

		if (article.changelog) {
			props.changelog = await serialize(article.changelog, {
				mdxOptions,
				scope,
			})
		}
	}

	return { props }
}
