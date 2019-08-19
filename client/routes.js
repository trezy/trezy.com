const routes = require('next-routes')()





const routeDefinitions = [
  {
    name: 'home',
    page: '/',
    pattern: '/index',
  },
  {
    name: 'about',
  },
  {
    name: 'blog',
  },
  {
    name: 'view article',
    page: '/blog/:id',
    pattern: '/blog/article',
  },
  {
    hidden: true,
    name: 'dashboard',
  },
  {
    hidden: true,
    name: 'blog dashboard',
    page: '/dashboard/blog',
  },
  {
    hidden: true,
    name: 'new article',
    page: '/dashboard/blog/edit/new',
    pattern: '/dashboard/blog/edit',
  },
  {
    hidden: true,
    name: 'edit article',
    page: '/dashboard/blog/edit/:id',
    pattern: '/dashboard/blog/edit',
  },
  {
    hidden: true,
    name: 'login',
  },
]

routeDefinitions.forEach(routeDefinition => {
  routes.add(routeDefinition)
  routes.routes[routes.routes.length - 1].hidden = Boolean(routeDefinition.hidden)
})





module.exports = routes
