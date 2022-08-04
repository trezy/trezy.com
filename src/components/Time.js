// Module imports
import {
	useLayoutEffect,
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'





export function Time(props) {
	const {
		separator,
		showDate,
		showTime,
		titlePrefix,
		value,
	} = props

	const [locale, setLocale] = useState('en-US')
	const Router = useRouter()

	const valueAsDate = useMemo(() => {
		if (value instanceof Date) {
			return value
		}

		return new Date(value)
	}, [value])

	const formattedValue = useMemo(() => {
		const pieces = []

		if (showTime) {
			const timeFormatter = new Intl.DateTimeFormat(locale, { timeStyle: 'short' })
			timeFormatter.format(valueAsDate)
		}

		if (showDate) {
			const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'long' })
			dateFormatter.format(valueAsDate)
		}

		return pieces.join(separator)
	}, [
		separator,
		showDate,
		showTime,
		locale,
		valueAsDate,
	])

	useEffect(() => {
		setLocale(Router.locale)
	}, [
		Router.locale,
		setLocale,
	])

	return (
		<time
			dateTime={valueAsDate.toISOString()}
			title={`${titlePrefix} ${valueAsDate.toUTCString()}`.trim()}>
			{formattedValue}
		</time>
	)
}

Time.defaultProps = {
	separator: ' - ',
	showDate: true,
	showTime: true,
	titlePrefix: '',
}

Time.propTypes = {
	separator: PropTypes.string,
	showDate: PropTypes.bool,
	showTime: PropTypes.bool,
	titlePrefix: PropTypes.string,
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]).isRequired,
}
