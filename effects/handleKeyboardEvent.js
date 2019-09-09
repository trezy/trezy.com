const handleKeyboardEvent = (eventType, handler) => () => {
  document.addEventListener(eventType, handler)

  return () => {
    document.removeEventListener(eventType, handler)
  }
}





export default handleKeyboardEvent
