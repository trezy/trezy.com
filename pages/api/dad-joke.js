// Local imports
import createEndpoint from './helpers/createEndpoint'





// Local imports
import httpStatus from '../../helpers/httpStatus'
import getJokes from './helpers/getJokes'





export const handler = (request, response) => {
  const filteredJokes = getJokes(request.query)
  const joke = filteredJokes[Math.floor(Math.random() * (filteredJokes.length))]

  response.status(httpStatus.OK).json({
    data: joke,
    meta: {},
  })
}





export default createEndpoint({
  allowedMethods: ['get'],
  handler,
})
