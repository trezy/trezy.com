// Module imports
import { useSelector } from 'react-redux'





const useCurrentUserIDSelector = () => useSelector(({ firebase }) => firebase.auth.uid)





export default useCurrentUserIDSelector
