export function stripMarkdown(markdown) {
	return (
		markdown
			// Remove code blocks
			.replace(/```[\s\S]*?```/g, "")
			.replace(/`([^`]+)`/g, "$1")
			// Remove images
			.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
			// Remove links but keep text
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
			// Remove headings markers
			.replace(/^#{1,6}\s+/gm, "")
			// Remove bold/italic
			.replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
			// Remove strikethrough
			.replace(/~~(.*?)~~/g, "$1")
			// Remove blockquotes
			.replace(/^>\s+/gm, "")
			// Remove horizontal rules
			.replace(/^[-*_]{3,}\s*$/gm, "")
			// Remove HTML tags
			.replace(/<[^>]+>/g, "")
			// Collapse multiple newlines
			.replace(/\n{3,}/g, "\n\n")
			.trim()
	);
}
