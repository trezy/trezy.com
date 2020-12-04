// Module imports
import {
	useEffect,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Component imports
import { ResponseForm } from 'components/ResponseForm'
import { ResponsesList } from 'components/ResponsesList'
import { useAuth } from 'contexts/AuthContext'





const Responses = props => {
	const { responses } = props
	// const { user } = useAuth()
	// const [hasRendered, setHasRendered] = useState(false)

	// useEffect(() => {
	// 	if (!responses) {
	// 		return
	// 	}

	// 	const [latestResponse] = responses
	// 	const responseElement = document.querySelector(`[id="${latestResponse.id}"]`)

	// 	if (!hasRendered || (user?.uid !== latestResponse.authorID) || !responseElement) {
	// 		console.log({responseElement})
	// 		// window.scrollTo({
	// 		// 	behavior: 'smooth',
	// 		// 	left: 0,
	// 		// 	top: responseElement.offsetTop,
	// 		// })
	// 	}
	// }, [responses])

	// useEffect(() => {
	// 	setHasRendered(true)
	// }, [setHasRendered])

	return (
		<aside className="block responses-container">
			<h3>Responses</h3>

			<div>
				<ResponsesList {...props} />

				<ResponseForm />
			</div>
		</aside>
	)
}

Responses.defaultProps = {
	responses: null,
}

Responses.propTypes = {
	responses: PropTypes.array,
}





export default Responses
