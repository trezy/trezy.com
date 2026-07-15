// Ports legacy/components/VersionPage/Dependencies.js +
// legacy/components/VersionPage/{DependencyList,DependencyCard}.js +
// legacy/components/Pagination/index.js into a single `<dependency-search>`
// custom element -- no React, no `Button`/`FontAwesomeIcon` components.
//
// Data source: `#deps-data`, a `<script type="application/json">` embedded
// by src/pages/version.astro from `getVersionData().dependencies` (an array
// of `{ name, version }` -- see src/lib/version.js). Legacy's dependency
// data was keyed by raw Yarn-style "matchers" (e.g. a package could be
// resolved by multiple semver-range keys joined with ", "), so
// `Dependencies.js` ran each key through `getDependencyNameFromMatchers()`
// to recover the bare package name, and `DependencyCard.js` rendered a much
// richer per-package shape (resolution, sub-dependencies, peer
// dependencies, an arbitrary leftover-fields debug `<pre>`). `bun.lock`
// entries are already keyed by the bare package name (no matcher-joining),
// and `getVersionData()` intentionally reduces each entry to `{ name,
// version }` (see src/lib/version.js's header comment / Task 25 report) --
// so neither the matcher-parsing helper nor the richer card fields have
// anything to port from; each card below just renders name + version.
//
// Pagination: ported from legacy/components/Pagination/index.js's page-window
// math (`pagesToShow` window centered on `currentPage`, first/last-page
// shortcut buttons when the window doesn't already include them). One
// deliberate fix: legacy's `while (pageList.length < pagesToShow) {
// pageList.unshift(pageList[0] - 1) }` has no lower bound, so when
// `totalPageCount < pagesToShow` (e.g. a search narrows results to fewer
// than 5 pages) it unshifts *below page 1* (page 0, -1, ...) to pad the
// window out to 5 buttons. That's reproduced here except the padding loop
// also stops at 1, so a short result set gets a short (correct) page list
// instead of negative-numbered page buttons.
import Fuse from 'fuse.js'

const PAGE_SIZE = 10
const PAGES_TO_SHOW = 5

const FUSE_OPTIONS = {
	keys: ['name'],
}

class DependencySearch extends HTMLElement {
	connectedCallback() {
		this.query = ''
		this.currentPage = 1
		this.allDependencies = this.readDependencies()
		this.filteredDependencies = []
		this.fuse = new Fuse(this.allDependencies, FUSE_OPTIONS)

		this.inputElement = this.querySelector('[data-role="query-input"]')
		this.listElement = this.querySelector('[data-role="dependency-list"]')
		this.paginationElement = this.querySelector('[data-role="pagination"]')

		this._onQueryChange = (event) => this.handleQueryChange(event)
		this._onPaginationClick = (event) => this.handlePaginationClick(event)

		this.inputElement?.addEventListener('input', this._onQueryChange)
		this.paginationElement?.addEventListener('click', this._onPaginationClick)

		this.render()
	}

	disconnectedCallback() {
		this.inputElement?.removeEventListener('input', this._onQueryChange)
		this.paginationElement?.removeEventListener('click', this._onPaginationClick)
		this.fuse = null
	}

	/** Reads/parses `#deps-data` (see src/pages/version.astro). Degrades to an empty list -- rather than throwing -- if the script tag is missing or unparseable, so a markup mistake elsewhere doesn't crash the whole island. */
	readDependencies() {
		const dataElement = document.getElementById('deps-data')

		if (!dataElement?.textContent) {
			return []
		}

		try {
			const dependencies = JSON.parse(dataElement.textContent)
			return Array.isArray(dependencies) ? dependencies : []
		} catch (error) {
			console.error('[DependencySearch] Failed to parse dependency data:', error)
			return []
		}
	}

	/** Mirrors legacy Dependencies.js's `handleQueryChange`: only refreshes `filteredDependencies` when there's a query at all; an emptied query falls back to `allDependencies` regardless of whatever's left over in `filteredDependencies`. */
	handleQueryChange(event) {
		const { value } = event.target

		this.query = value

		if (value) {
			this.filteredDependencies = this.fuse.search(value).map((result) => result.item)
		}

		this.currentPage = 1
		this.render()
	}

	handlePaginationClick(event) {
		const button = event.target.closest('button[data-page]')

		if (!button || button.disabled) {
			return
		}

		this.currentPage = Number(button.dataset.page)
		this.render()
	}

	getVisibleDependencies() {
		return this.query ? this.filteredDependencies : this.allDependencies
	}

	render() {
		this.renderList()
		this.renderPagination()
	}

	/** Ports DependencyList.js's rendering (minus the `isFiltered`/matcher-key branching -- see file header) as a plain `<li><div class="card">...` per visible, paginated dependency. */
	renderList() {
		if (!this.listElement) {
			return
		}

		const dependencies = this.getVisibleDependencies()
		const sliceStart = (this.currentPage - 1) * PAGE_SIZE
		const page = dependencies.slice(sliceStart, sliceStart + PAGE_SIZE)

		this.listElement.replaceChildren(...page.map((dependency) => this.buildCard(dependency)))
	}

	/** Ports DependencyCard.js's markup shape (`div.card > header > span.title` + `div.content > dl`), reduced to the `name`/`version` fields `getVersionData()` provides -- see file header. */
	buildCard(dependency) {
		const item = document.createElement('li')

		const card = document.createElement('div')
		card.className = 'card'

		const header = document.createElement('header')
		const title = document.createElement('span')
		title.className = 'title'
		title.textContent = dependency.name
		header.append(title)

		const content = document.createElement('div')
		content.className = 'content'

		const dl = document.createElement('dl')
		const versionTerm = document.createElement('dt')
		versionTerm.textContent = 'Version'
		const versionDescription = document.createElement('dd')
		versionDescription.textContent = dependency.version
		dl.append(versionTerm, versionDescription)

		content.append(dl)
		card.append(header, content)
		item.append(card)

		return item
	}

	/** Ports legacy/components/Pagination/index.js's page-window + first/last shortcut logic (see file header for the one deliberate fix). */
	renderPagination() {
		if (!this.paginationElement) {
			return
		}

		this.paginationElement.replaceChildren()

		const dependencies = this.getVisibleDependencies()
		const totalPageCount = Math.ceil(dependencies.length / PAGE_SIZE)

		if (!totalPageCount) {
			return
		}

		const currentPage = this.currentPage
		const nextPage = currentPage + 1
		const previousPage = currentPage - 1
		const middlePageIndex = Math.round(PAGES_TO_SHOW / 2) - 1

		let firstPage = currentPage - middlePageIndex
		let lastPage = currentPage + middlePageIndex

		if (firstPage < 1) {
			firstPage = 1
		}

		if (lastPage > totalPageCount) {
			lastPage = totalPageCount
		}

		const pageList = []

		for (let index = 0; index < PAGES_TO_SHOW; index++) {
			const newPage = firstPage + index

			if (newPage <= totalPageCount) {
				pageList.push(newPage)
			}
		}

		while (pageList.length < PAGES_TO_SHOW && pageList[0] > 1) {
			pageList.unshift(pageList[0] - 1)
		}

		this.paginationElement.append(
			this.buildPageButton(previousPage, 'Previous', { disabled: currentPage === 1 }),
		)

		if (firstPage > 1) {
			this.paginationElement.append(this.buildPageButton(1, '1'))
		}

		const pageListElement = document.createElement('ol')
		pageListElement.className = 'page-list'

		for (const pageNumber of pageList) {
			const item = document.createElement('li')
			item.append(this.buildPageButton(pageNumber, String(pageNumber), { disabled: pageNumber === currentPage }))
			pageListElement.append(item)
		}

		this.paginationElement.append(pageListElement)

		if (lastPage < totalPageCount) {
			this.paginationElement.append(this.buildPageButton(totalPageCount, String(totalPageCount)))
		}

		this.paginationElement.append(
			this.buildPageButton(nextPage, 'Next', { disabled: currentPage === totalPageCount }),
		)
	}

	buildPageButton(page, label, options = {}) {
		const button = document.createElement('button')
		button.type = 'button'
		button.dataset.page = String(page)
		button.textContent = label

		if (options.disabled) {
			button.disabled = true
		}

		return button
	}
}

customElements.define('dependency-search', DependencySearch)
