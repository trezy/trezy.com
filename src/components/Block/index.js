// Module imports
import { useMemo } from 'react'
import classnames from 'classnames'
import Image from 'next/image'





export function Block(props) {
	const {
		children,
		className,
		headerImageSource,
	} = props

	const dataAttributes = useMemo(() => {
		const propEntries = Object.entries(props)

		return propEntries.reduce((accumulator, [key, value]) => {
			if (key.startsWith('data-')) {
				accumulator[key] = value
			}

			return accumulator
		}, {})
	}, [props])

	return (
		<div
			className={classnames('block', className)}
			{...dataAttributes}>
			{Boolean(headerImageSource) && (
				<div className="block-header-image">
					<Image
						layout="fill"
						objectFit="cover"
						src={headerImageSource} />
				</div>
			)}

			{children}
		</div>
	)
}
