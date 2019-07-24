// Module imports
import axios from 'axios'
import getConfig from 'next/config'





// Local constants
const { publicRuntimeConfig } = getConfig()
const tmdbAPIConfig = publicRuntimeConfig.apis.tmdb

let instance = null





export default function getTMDbService () {
  if (!instance) {
    instance = axios.create({
      baseURL: tmdbAPIConfig.url,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })
  }

  return instance
}
