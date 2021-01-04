// Local imports
import { Kroki } from 'helpers/markdownRenderers/Kroki'





function DITAA(props) {
	return (
		<Kroki
			{...props}
		 	type="ditaa" />
	)
}

export { DITAA }
