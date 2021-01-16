export function getDependencyNameFromMatchers(matchers) {
	const [, dependencyName] = /^(@?[-\/\w\d]+)@?/mu.exec(matchers)
	return dependencyName
}
