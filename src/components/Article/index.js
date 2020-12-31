// Component imports
import { useArticle } from 'contexts/ArticleContext'
// import ArticleMeta from 'components/ArticleMeta'
import MarkdownRenderer from 'components/MarkdownRenderer'
import Responses from 'components/Responses'





export function Article() {
	const {
		article,
		responses,
	} = useArticle()

	return (
		<>
			<article className="block">
				{/* <ArticleMeta {...article} /> */}

				<MarkdownRenderer children={article.body} />
			</article>

			<Responses responses={responses} />
		</>
	)
}
