// Module imports
import cors from 'micro-cors'





// Local imports
import httpStatus from 'helpers/httpStatus'





// Local constants
const defaultMiddlewares = [cors()]





const createEndpoint = options => {
  const {
    handler: initialHandler,
    allowedMethods,
    middlewares = [],
  } = options

  const allMiddlewares = [
    ...defaultMiddlewares,
    ...middlewares,
  ]

  const wrappedHandler = allMiddlewares.reduce(
    (handler, middleware) => middleware(handler),
    initialHandler,
  )

  return (req, res) => {
    if (allowedMethods && !allowedMethods.includes(req.method.toLowerCase())) {
      return res.status(httpStatus.METHOD_NOT_ALLOWED).end()
    }

    return wrappedHandler(req, res)
  }
}





export default createEndpoint
