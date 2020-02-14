// Module imports
import { useSelector } from 'react-redux'





const useUserSelector = ({ userID }) => useSelector(({ firestore }) => firestore.data.users?.[userID])





export default useUserSelector
