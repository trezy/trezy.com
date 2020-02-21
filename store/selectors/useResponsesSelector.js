// Module imports
import { useSelector } from 'react-redux'





const useResponsesSelector = () => useSelector(({ firestore }) => {
  const {
    responses,
    responsesPendingAkismetVerification,
    responsesPendingHumanVerification,
  } = firestore.ordered

  const allResponses = [
    ...(responses || []),
    ...(responsesPendingAkismetVerification || []),
    ...(responsesPendingHumanVerification || []),
  ]

  return allResponses.sort((responseA, responseB) => {
    if (responseA.publishedAt > responseB.publishedAt) {
      return 1
    }

    if (responseA.publishedAt < responseB.publishedAt) {
      return -1
    }

    if (responseA.nanoseconds > responseB.nanoseconds) {
      return 1
    }

    if (responseA.nanoseconds < responseB.nanoseconds) {
      return -1
    }

    return 0
  })
})





export default useResponsesSelector
