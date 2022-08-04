// Module imports
import { useEffect } from 'react'





// Local imports
import * as API from '../helpers/API.js'





export function useAnalytics() {
	useEffect(() => {
		API.getBrowserID()
	}, [])
}
