// Module imports
import NextLink from 'next/link'





// Local imports
import { ExternalLink } from 'components/ExternalLink'





export function Link(node) {
	if (node.href.startsWith('/')) {
		return (
			<NextLink href={node.href}>
				{node.children}
			</NextLink>
		)
	}

	return (
		<ExternalLink href={node.href}>
			{node.children}
		</ExternalLink>
	)
}
