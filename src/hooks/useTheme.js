// Module imports
import { useEffect } from 'react'





// Local imports
import { updateTheme } from 'helpers/updateTheme'
import { useLocalForage } from 'hooks/useLocalForage'





export function useTheme() {
	const LocalForage = useLocalForage()

	useEffect(async () => {
		const theme = await LocalForage.getItem('theme')
		updateTheme(theme)
	}, [])
}
