// Module imports
import { useEffect } from 'react'





const useWindowEvent = (eventType, handler, dependencies = []) => {
	useEffect(() => {
		window.addEventListener(eventType, handler)

		return () => window.removeEventListener(eventType, handler)
	}, dependencies)
}





export default useWindowEvent
