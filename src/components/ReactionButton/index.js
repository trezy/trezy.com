// Module imports
import { LikeButton } from '@lyket/react'
import { useCallback } from 'react'
import classnames from 'classnames'





// Module imports
import { Button } from 'components/Button.js'





export function ReactionButton(props) {
	const {
		emoji,
		emojiName,
		id,
		namespace,
	} = props

	const renderProps = useCallback(({ handlePress, totalLikes, userLiked, isLoading }) => {
		const compiledClassNames = classnames('reaction', {
			'is-active': userLiked,
		})

		return (
			<Button
				className={compiledClassNames}
				disabled={isLoading}
				isStyled={false}
				onClick={handlePress}>
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
