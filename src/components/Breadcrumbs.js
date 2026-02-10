// Module imports
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'





export default function Breadcrumbs(props) {
	const { crumbs } = props

	return (
		<ul className="breadcrumbs inline slash-separated">
			<li>
				<Link href="/">
					<FontAwesomeIcon
						fixedWidth
						icon={faHome} />
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
							{name}
						</Link>
					</li>
				)
			})}
		</ul>
	)
}
