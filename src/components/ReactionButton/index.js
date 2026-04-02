'use client'

// Module imports
import classnames from 'classnames'
import {
	useCallback,
	useState,
} from 'react'

// Local imports
import { Button } from 'components/Button.js'

let floatingID = 0

export function ReactionButton(props) {
	const {
		emoji,
		handleClick,
		handleContextMenu,
		isActive,
		isMaxed,
		reactionCount,
	} = props

	const [floatingEmojis, setFloatingEmojis] = useState([])

	const compiledClassNames = classnames('reaction', {
		'is-active': isActive,
	})

	const handleClickWithFlair = useCallback(event => {
		if (!isMaxed) {
			const id = ++floatingID
			const drift = (Math.random() - 0.5) * 2
			setFloatingEmojis(prev => [...prev, { id, drift }])
			setTimeout(() => {
				setFloatingEmojis(prev => prev.filter(e => e.id !== id))
			}, 600)
		}
		handleClick(event)
	}, [handleClick, isMaxed])

	return (
		<Button
			className={compiledClassNames}
			isStyled={false}
			onClick={handleClickWithFlair}
			onContextMenu={handleContextMenu}>
			{emoji}

			{(reactionCount !== 0) && (
				<span className="badge">{reactionCount}</span>
			)}

			{floatingEmojis.map(({ id, drift }) => (
				<span
					key={id}
					className="floating-emoji"
					style={{ '--drift': `${drift}rem` }}>
					{emoji}
				</span>
			))}
		</Button>
	)
}
