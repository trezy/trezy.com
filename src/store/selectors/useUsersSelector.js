// Module imports
import { useSelector } from 'react-redux'





const useUsersSelector = () => useSelector(({ firestore }) => firestore.ordered.users)





export default useUsersSelector
