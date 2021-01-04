// Local imports
import { Kroki } from 'helpers/markdownRenderers/Kroki'





function PlantUML(props) {
	return (
		<Kroki
			{...props}
		 	type="plantuml" />
	)
}

export { PlantUML }
