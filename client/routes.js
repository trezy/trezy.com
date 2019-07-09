const routes = require('next-routes')()





// 'NAME', 'ROUTE', 'PATH'
// Ordered in general page group priority. Priority is determined by general amount of use of the set of pages.

// Home
routes.add('home', '/', '/index')

// About
routes.add('about', '/about', '/about')





module.exports = routes
