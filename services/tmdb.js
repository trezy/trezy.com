/* eslint-env node */
// Module imports
import axios from 'axios'





// Local variables
let instance = null





export default function getTMDbService () {
  if (!instance) {
    instance = axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })
  }

  return instance
}
