// Module imports
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import semver from 'semver'





export function DependencyRow(props) {
	const {
		name,
		requiredVersion,
	} = props
	const [latestVersion, setLatestVersion] = useState(null)

	const updateLatestVersion = useCallback(async () => {
		const response = await fetch(`https://registry.npmjs.org/${name}/latest`)
		const responseJSON = await response.json()

		setLatestVersion(responseJSON.version)
	}, [
		name,
		setLatestVersion,
	])

	const compiledClassName = useMemo(() => {
		return classnames({
			'is-out-of-date': Boolean(latestVersion)
				? !semver.satisfies(latestVersion, requiredVersion)
				: false,
		})
	}, [
		latestVersion,
		requiredVersion,
	])

	useEffect(() => {
		updateLatestVersion()
	}, [updateLatestVersion])

	return (
		<tr className={compiledClassName}>
			<th scope={'row'}>{name}</th>
			<td>{requiredVersion}</td>
			<td>
				{!latestVersion && 'Getting latest version...'}

				{Boolean(latestVersion) && latestVersion}
			</td>
		</tr>
	)
}

DependencyRow.propTypes = {
	name: PropTypes.string.isRequired,
	requiredVersion: PropTypes.string.isRequired,
}
