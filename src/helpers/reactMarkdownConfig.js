// Module imports
import behead from 'remark-behead'
import directive from 'remark-directive'
import gfm from 'remark-gfm'
import squeezeParagraphs from 'remark-squeeze-paragraphs'





// Local imports
import { Code } from 'components/Code'
import {
	Directive,
	Image,
	List,
} from 'helpers/markdownRenderers'





export const config = {
	allowDangerousHtml: false,
	plugins: [
		[behead, { depth: 1 }],
		gfm,
		directive,
		squeezeParagraphs,
	],
	renderers: {
		code: Code,
		image: Image,
		imageReference: Image,
		list: List,
		textDirective: Directive,
		leafDirective: Directive,
		containerDirective: Directive,
	},
}
