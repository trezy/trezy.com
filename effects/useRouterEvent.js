import Router from 'next/router'





const useRouterEvent = (eventType, handler) => () => {
  Router.events.on(eventType, handler)

  return () => Router.events.off(eventType, handler)
}





export default useRouterEvent
