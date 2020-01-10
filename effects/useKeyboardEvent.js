const useKeyboardEvent = (eventType, handler) => () => {
  document.addEventListener(eventType, handler)

  return () => {
    document.removeEventListener(eventType, handler)
  }
}





export default useKeyboardEvent
