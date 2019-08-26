const routes = require('next-routes')()





const routeDefinitions = [
  {
    changeFrequency: 'always',
    name: 'home',
    priority: 0.5,
    page: '/index',
    pattern: '/',
  },
  {
    changeFrequency: 'monthly',
    name: 'about',
    priority: 0.6,
  },
  {
    changeFrequency: 'daily',
    name: 'blog',
    priority: 0.7,
  },
  {
    hidden: true,
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

if (typeof window === 'undefined') {
  routeDefinitions.forEach(routeDefinition => {
    const replicateKeys = [
      'changeFrequency',
      'priority',
    ]

    routes.add(routeDefinition)

    const route = routes.routes[routes.routes.length - 1]

    route.hidden = Boolean(routeDefinition.hidden)

    replicateKeys.forEach(key => {
      if (routeDefinition[key]) {
        route[key] = routeDefinition[key]
      }
    })
  })
}





module.exports = routes
