// Component imports
import PropTypes from 'prop-types'





// Local imports
import { ArticleContextProvider } from 'contexts/ArticleContext'
import { ArticleEditor } from 'components/Dashboard/Blog/Edit'





function ArticleEditorPage(props) {
	const { id } = props

	return (
		<ArticleContextProvider
			id={id}
			isNew={id === 'new'}>
			<ArticleEditor articleID={id} />
		</ArticleContextProvider>
	)
}

ArticleEditorPage.propTypes = {
	id: PropTypes.string.isRequired,
}

export async function getServerSideProps(context) {
	const { id } = context.params

	return {
		props: {
			id,
		}
	}
}





export default ArticleEditorPage
