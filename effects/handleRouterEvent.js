import Router from 'next/router'





const handleRouterEvent = (eventType, handler) => () => {
  Router.events.on(eventType, handler)

  return () => Router.events.off(eventType, handler)
}





export default handleRouterEvent
