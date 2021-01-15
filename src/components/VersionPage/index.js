// Local imports
import PageWrapper from 'components/PageWrapper'
import { Dependencies } from 'components/VersionPage/Dependencies'
import { Environment } from 'components/VersionPage/Environment'
import { Git } from 'components/VersionPage/Git'





export function VersionPage(props) {
	return (
		<PageWrapper title="Version Information">
			<Environment {...props} />
			<Git {...props} />
			<Dependencies {...props} />
		</PageWrapper>
	)
}
