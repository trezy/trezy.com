// Module imports
import { useSelector } from 'react-redux'





const useCurrentUserSelector = () => useSelector(state => {
  const {
    firebase,
    firestore,
  } = state

  return firestore.data.users?.[firebase.auth?.uid]
})





export default useCurrentUserSelector
