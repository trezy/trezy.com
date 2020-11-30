// Module imports
import Link from 'next/link'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'





export default function Breadcrumbs(props) {
	const { crumbs } = props

	return (
		<ul className="breadcrumbs inline slash-separated">
			<li>
				<Link href="/">
					<a>
						<FontAwesomeIcon
							fixedWidth
							icon="home" />
					</a>
				</Link>
			</li>

			{crumbs.map((crumb, index) => {
				const [name, href] = crumb

				if (index === (crumbs.length - 1)) {
					return (
						<li key={name}>{name}</li>
					)
				}

				return (
					<li key={name}>
						<Link href={href}>
							<a>{name}</a>
						</Link>
					</li>
				)
			})}
		</ul>
	)
}
