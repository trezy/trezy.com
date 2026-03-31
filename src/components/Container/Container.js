export function Container(props) {
	const { children } = props

	return (
		<div className={'container'}>
			{children}
		</div>
	)
}