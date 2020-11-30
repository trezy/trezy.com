// Module imports
import { FontAwesomeIcon as OriginalFontAwesomeIcon } from '@fortawesome/react-fontawesome'





export function FontAwesomeIcon(props) {
	if (typeof window === 'undefined') {
		return null
	}

	return (
		<OriginalFontAwesomeIcon {...props} />
	)
}
