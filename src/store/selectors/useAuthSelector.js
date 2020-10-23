import { useSelector } from 'react-redux'





const useAuthSelector = () => useSelector(state => state.firebase.auth)





export default useAuthSelector
