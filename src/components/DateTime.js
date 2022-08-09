// Module imports
import {
	useEffect,
	useMemo,
	useState,
} from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'





export function DateTime(props) {
	const {
		dateFormat,
		separator,
		showDate,
		showPrefix,
		showTime,
		timeFormat,
		prefix,
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

		if (showPrefix) {
			const timeFormatter = new Intl.DateTimeFormat(locale, timeFormat)
			pieces.push(timeFormatter.format(valueAsDate))
		}

		if (showTime) {
			const timeFormatter = new Intl.DateTimeFormat(locale, timeFormat)
			pieces.push(timeFormatter.format(valueAsDate))
		}

		if (showDate) {
			const dateFormatter = new Intl.DateTimeFormat(locale, dateFormat)
			pieces.push(dateFormatter.format(valueAsDate))
		}

		let result = pieces.join(separator)

		if (showPrefix) {
			result = `${prefix} ${result}`
		}

		return result
	}, [
		dateFormat,
		prefix,
		separator,
		showDate,
		showPrefix,
		showTime,
		locale,
		timeFormat,
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
			title={`${prefix} ${valueAsDate.toUTCString()}`.trim()}>
			{formattedValue}
		</time>
	)
}

DateTime.defaultProps = {
	dateFormat: {
		dateStyle: 'long',
	},
	prefix: '',
	separator: ' - ',
	showDate: true,
	showPrefix: false,
	showTime: true,
	timeFormat: {
		timeStyle: 'short',
	},
	titlePrefix: '',
}

DateTime.propTypes = {
	dateFormat: PropTypes.shape({
		calendar: PropTypes.oneOf([
			'buddhist',
			'chinese',
			'coptic',
			'dangi',
			'ethioaa',
			'ethiopic',
			'gregory',
			'hebrew',
			'indian',
			'islamic',
			'islamic-umalqura',
			'islamic-tbla',
			'islamic-civil',
			'islamic-rgsa',
			'iso8601',
			'japanese',
			'persian',
			'roc',
			'islamicc',
		]),
		dateStyle: PropTypes.oneOf([
			'long',
			'medium',
			'short',
		]),
		day: PropTypes.oneOf([
			'2-digit',
			'numeric',
		]),
		era: PropTypes.oneOf([
			'long',
			'narrow',
			'short',
		]),
		month: PropTypes.oneOf([
			'2-digit',
			'long',
			'narrow',
			'numeric',
			'short',
		]),
		numberingSystem: PropTypes.oneOf([
			'arab',
			'arabext',
			'bali',
			'beng',
			'deva',
			'fullwide',
			' gujr',
			'guru',
			'hanidec',
			'khmr',
			' knda',
			'laoo',
			'latn',
			'limb',
			'mlym',
			'mong',
			'mymr',
			'orya',
			'tamldec',
			'telu',
			'thai',
			'tibt',
		]),
		weekday: PropTypes.oneOf([
			'long',
			'narrow',
			'short',
		]),
		year: PropTypes.oneOf([
			'2-digit',
			'numeric',
		]),
	}),
	prefix: PropTypes.string,
	separator: PropTypes.string,
	showDate: PropTypes.bool,
	showPrefix: PropTypes.bool,
	showTime: PropTypes.bool,
	timeFormat: PropTypes.shape({
		dayPeriod: PropTypes.oneOf([
			'long',
			'narrow',
			'short',
		]),
		fractionalSecondDigits: PropTypes.oneOf([
			0,
			1,
			2,
			3,
		]),
		hour: PropTypes.oneOf([
			'2-digit',
			'numeric',
		]),
		hour12: PropTypes.bool,
		hourCycle: PropTypes.oneOf([
			'h11',
			'h12',
			'h23',
			'h24',
		]),
		minute: PropTypes.oneOf([
			'2-digit',
			'numeric',
		]),
		second: PropTypes.oneOf([
			'2-digit',
			'numeric',
		]),
		timeStyle: PropTypes.oneOf([
			'full',
			'long',
			'medium',
			'short',
		]),
		timeZone: PropTypes.string,
		timeZoneName: PropTypes.oneOf([
			'long',
			'longGeneric',
			'longOffset',
			'short',
			'shortGeneric',
			'shortOffset',
		]),
	}),
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]).isRequired,
}
