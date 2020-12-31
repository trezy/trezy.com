// Module imports
import behead from 'remark-behead'
import directive from 'remark-directive'
import squeezeParagraphs from 'remark-squeeze-paragraphs'





// Local imports
import {
	Code,
	Directive,
	Image,
	List,
	Shortcode,
} from 'helpers/markdownRenderers'
import {
	properties,
} from 'helpers/remark'





export const config = {
	allowDangerousHtml: false,
	plugins: [
		[behead, { depth: 1 }],
		properties,
		directive,
		squeezeParagraphs,
	],
	renderers: {
		code: Code,
		image: Image,
		imageReference: Image,
		list: List,
		shortcode: Shortcode,
		textDirective: Directive,
		leafDirective: Directive,
		containerDirective: Directive,
	},
}
