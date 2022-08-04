// Module imports
import { LikeButton } from '@lyket/react'
import {
	useCallback,
	useMemo,
} from 'react'
import classnames from 'classnames'





// Module imports
import { Button } from 'components/Button.js'
// import { useAckee } from 'hooks/useAckee.js'





export function ReactionButton(props) {
	const {
		emoji,
		handleClick,
		isActive,
		reactionCount,
	} = props
	// const { trackAction } = useAckee()

	const compiledClassNames = classnames('reaction', {
		'is-active': isActive,
	})

	// const handleClick = useCallback(event => {
	// 	// handlePress(event)
	// 	// trackAction('489767f3-4997-4a8e-9ed9-3d4bdf857f53', {
	// 	// 	key: reactionID,
	// 	// 	value: 1,
	// 	// })
	// }, [
	// 	// handlePress,
	// 	// trackAction,
	// ])

	return (
		<Button
			className={compiledClassNames}
			isStyled={false}
			onClick={handleClick}>
			{emoji}

			{(reactionCount !== 0) && (
				<span className="badge">{reactionCount}</span>
			)}
		</Button>
	)
}
