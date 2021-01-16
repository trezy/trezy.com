// Module imports
import { useCallback } from 'react'
import PropTypes from 'prop-types'





// Local imports
import Button from 'components/Button'





function Pagination(props) {
	const {
		currentPage,
		onPageChange,
		pagesToShow,
		totalPageCount,
	} = props

	const handlePageButtonClick = useCallback(event => onPageChange(event.target.value), [currentPage])

	const pageButtons = []
	const maxButtonsToRender = Math.min(totalPageCount, pagesToShow)

	let firstPage = Math.floor(currentPage - (Math.round(maxButtonsToRender / 2) - 1))
	let lastPage = Math.floor(currentPage + Math.round(maxButtonsToRender / 2))

	if (lastPage > totalPageCount) {
		lastPage = totalPageCount
	}

	if (firstPage < 1) {
		firstPage = 1
	}

	if (totalPageCount > 1) {
		while (pageButtons.length < maxButtonsToRender) {
			const pageNumber = firstPage + pageButtons.length
			const isCurrentPage = pageNumber === currentPage

			if (pageNumber > lastPage) {
				break
			}

			pageButtons.push((
				<li key={pageNumber}>
					<Button
						disabled={isCurrentPage}
						onClick={handlePageButtonClick}
						value={pageNumber}>
						{pageNumber}
					</Button>
				</li>
			))
		}
	}

	return (
		<ol className="pagination">{pageButtons}</ol>
	)
}

Pagination.defaultProps = {
	pagesToShow: 5,
}

Pagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	pagesToShow: PropTypes.number,
	totalPageCount: PropTypes.number.isRequired,
}

export { Pagination }
