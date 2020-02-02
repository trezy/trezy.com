// Module imports
import { useSelector } from 'react-redux'





const useAuthorSelector = ({ authorID }) => useSelector(({ firestore }) => firestore.data.users?.[authorID])





export default useAuthorSelector
