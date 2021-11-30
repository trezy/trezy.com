// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { useFirebase } from 'hooks/useFirebase'




export const RolesContext = createContext({
	isLoaded: false,
	roles: null,
})





export function RolesContextProvider(props) {
	const {
		children,
	} = props
	const {
		firestore,
	} = useFirebase()
	const {
		current: collection,
	} = useRef(firestore?.collection('roles'))
	const [roles, setRoles] = useState()
	const [isLoaded, setIsLoaded] = useState(false)

	const handleSnapshot = useCallback(snapshot => {
		setRoles(previousValue => {
			const newValue = { ...previousValue }

			snapshot.docChanges().forEach(change => {
				const {
					doc,
					type,
				} = change

				if (['added', 'modified'].includes(type)) {
					newValue[doc.id] = doc.data()
				} else {
					delete newValue[doc.id]
				}
			})

			return newValue
		})

		setIsLoaded(true)
	}, [
		setIsLoaded,
		setRoles,
	])

	useEffect(() => collection.onSnapshot(handleSnapshot), [handleSnapshot])

	return (
		<RolesContext.Provider
			value={{
				isLoaded,
				roles,
			}}>
			{children}
		</RolesContext.Provider>
	)
}

RolesContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export const useRoles = () => useContext(RolesContext)
