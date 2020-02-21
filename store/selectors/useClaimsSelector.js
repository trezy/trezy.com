import { useSelector } from 'react-redux'





const useClaimsSelector = () => useSelector(state => (state.firebase.profile.token?.claims || {}))





export default useClaimsSelector
