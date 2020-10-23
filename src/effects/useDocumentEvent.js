// Module imports
import { useEffect } from 'react'





const useDocumentEvent = (eventType, handler, dependencies = []) => {
  useEffect(() => {
    document.addEventListener(eventType, handler)

    return () => document.removeEventListener(eventType, handler)
  }, dependencies)
}





export default useDocumentEvent
