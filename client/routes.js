const routes = require('next-routes')()





const routeDefinitions = [
  {
    name: 'home',
    page: '/index',
    pattern: '/',
  },
  {
    name: 'about',
  },
  {
    name: 'blog',
  },
  {
    name: 'view article',
    page: '/blog/article',
    pattern: '/blog/:id',
  },
  {
    hidden: true,
    name: 'dashboard',
  },
  {
    hidden: true,
    name: 'blog dashboard',
    pattern: '/dashboard/blog',
  },
  {
    hidden: true,
    name: 'new article',
    page: '/dashboard/blog/edit',
    pattern: '/dashboard/blog/edit/new',
  },
  {
    hidden: true,
    name: 'edit article',
    page: '/dashboard/blog/edit',
    pattern: '/dashboard/blog/edit/:id',
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
