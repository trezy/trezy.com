export function updateTheme(theme) {
	const rootElement = document.querySelector('html')
	rootElement.classList.remove('dark', 'light', 'system')
	rootElement.classList.add(theme)
}
