import { useEffect } from 'react'
import { useRouter } from 'next/router'





const useRouterEvent = (eventType, handler, dependencies = []) => {
	const Router = useRouter()

	useEffect(() => {
		Router.events.on(eventType, handler)

		return () => Router.events.off(eventType, handler)
	}, dependencies)
}





export default useRouterEvent
