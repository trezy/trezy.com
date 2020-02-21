// Module imports
import { useSelector } from 'react-redux'





// const useUserSelector = ({ userID }) => useSelector(({ firestore }) => firestore.data.users?.[userID])
const useUserSelector = options => {
  const {
    userID,
    username,
  } = options

  let selectorMethod = ({ firestore }) => firestore.ordered.users?.find(user => (user.username === username))

  if (userID) {
    selectorMethod = ({ firestore }) => firestore.data.users?.[userID]
  }

  return useSelector(selectorMethod)
}





export default useUserSelector
