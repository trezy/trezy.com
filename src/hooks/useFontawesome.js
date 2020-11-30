// Module imports
import {
	config,
	library,
} from '@fortawesome/fontawesome-svg-core'
// import { useEffect } from 'react'





// Local imports
import * as fasIcons from 'helpers/fasIconLibrary'
import * as fabIcons from 'helpers/fabIconLibrary'
import * as farIcons from 'helpers/farIconLibrary'





// Local variables
let isConfigured = false





export function useFontawesome() {
	if ((typeof window !== 'undefined') && !isConfigured) {
		isConfigured = true

		// Configure and populate FontAwesome library
		config.autoAddCss = false
		library.add(fasIcons)
		library.add(fabIcons)
		library.add(farIcons)
	}
}
