// Module imports
import { useCallback } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import Button from 'components/Button'





function Pagination(props) {
	const {
		currentPage,
		onPageChange,
		pagesToShow,
		totalPageCount,
	} = props

	const handlePageButtonClick = useCallback(event => onPageChange(event.target.value), [currentPage])

	if (!totalPageCount) {
		return null
	}

	const nextPage = currentPage + 1
	const previousPage = currentPage - 1

	const middlePageIndex = Math.round(pagesToShow / 2) - 1
	let firstPage = currentPage - middlePageIndex
	let lastPage = currentPage + middlePageIndex

	if (firstPage < 1) {
		firstPage = 1
	}

	if (lastPage > totalPageCount) {
		lastPage = totalPageCount
	}

	const pageList = []

	for (var index = 0; index < pagesToShow; index++) {
		const newPage = firstPage + index

		if (newPage <= totalPageCount) {
			pageList.push(newPage)
		}
	}

	while (pageList.length < pagesToShow) {
		pageList.unshift(pageList[0] - 1)
	}

	return (
		<div className="pagination">
			<Button
				onClick={handlePageButtonClick}
				value={previousPage}>
				<FontAwesomeIcon
					fixedWidth
					icon="arrow-left" />
			</Button>

			{(firstPage > 1) && (
				<Button
					onClick={handlePageButtonClick}
					value="1">
					1
				</Button>
			)}

			<ol className="page-list">
				{pageList.map(pageNumber => (
					<li key={pageNumber}>
						<Button
							disabled={pageNumber === currentPage}
							onClick={handlePageButtonClick}
							value={pageNumber}>
							{pageNumber}
						</Button>
					</li>
				))}
			</ol>

			{(lastPage < totalPageCount) && (
				<Button
					onClick={handlePageButtonClick}
					value={totalPageCount}>
					{totalPageCount}
				</Button>
			)}

			<Button
				onClick={handlePageButtonClick}
				value={nextPage}>
				<FontAwesomeIcon
					fixedWidth
					icon="arrow-right" />
			</Button>
		</div>
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
