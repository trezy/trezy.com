// Module imports
import {
	useEffect,
	useState,
} from 'react'





// Local imports
import { auth } from 'helpers/firebase'





export const useFirebaseAuthentication = () => {
	const [user, setUser] = useState(null)

	useEffect(() => auth.onAuthStateChanged(user => setUser(user)), [setUser])

	return user
}
