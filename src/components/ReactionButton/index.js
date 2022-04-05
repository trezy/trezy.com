// Module imports
import { LikeButton } from '@lyket/react'
import { useCallback } from 'react'
import classnames from 'classnames'





// Module imports
import { Button } from 'components/Button.js'
import { useAckee } from 'hooks/useAckee.js'





export function ReactionButton(props) {
	const {
		emoji,
		emojiName,
		id,
		namespace,
	} = props


	const renderProps = useCallback(({ handlePress, totalLikes, userLiked, isLoading }) => {
		const { trackAction } = useAckee()

		const handleClick = useCallback(event => {
			handlePress(event)
			trackAction('489767f3-4997-4a8e-9ed9-3d4bdf857f53', {
				key: `${id}-${emojiName}`,
				value: 1,
			})
		}, [handlePress])

		const compiledClassNames = classnames('reaction', {
			'is-active': userLiked,
		})

		return (
			<Button
				className={compiledClassNames}
				disabled={isLoading}
				isStyled={false}
				onClick={handleClick}>
				{emoji}

				{(totalLikes !== 0) && (
					<span className="badge">{totalLikes}</span>
				)}
			</Button>
		)
	}, [emoji])

	return (
		<LikeButton
			id={`${id}-${emojiName}`}
			namespace={namespace}>
			{renderProps}
		</LikeButton>
	)
}
