const routes = require('next-routes')()





// 'NAME', 'ROUTE', 'PATH'
// Ordered in general page group priority. Priority is determined by general amount of use of the set of pages.

// Home
routes.add('home', '/', '/index')

// About
routes.add('about')

// Dashboard
routes.add('dashboard')

// Dashboard / Blog
routes.add('blog')
routes.add('view article', '/blog/:id', '/blog/article')

// Dashboard / Blog
routes.add('blog dashboard', '/dashboard/blog', '/dashboard/blog')
routes.add('new article', '/dashboard/blog/edit/new', '/dashboard/blog/edit')
routes.add('edit article', '/dashboard/blog/edit/:id', '/dashboard/blog/edit')

// Login
routes.add('login', '/login', '/login')





module.exports = routes
