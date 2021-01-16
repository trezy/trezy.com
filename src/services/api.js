/* eslint-env node */
// Module imports
import axios from 'axios'





// Local variables
let instance = null





export default function getAPIService () {
	if (!instance) {
		instance = axios.create({
			baseURL: '/api',
			headers: { 'Content-Type': 'application/json' },
			timeout: 10000,
		})
	}

	return instance
}
