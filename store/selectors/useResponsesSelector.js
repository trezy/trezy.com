// Module imports
import { useSelector } from 'react-redux'





const useResponsesSelector = () => useSelector(({ firestore }) => firestore.ordered.responses)





export default useResponsesSelector
