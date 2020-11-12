// Module imports
import behead from 'remark-behead'
import shortcodes from 'remark-shortcodes'
import squeezeParagraphs from 'remark-squeeze-paragraphs'





// Local imports
import {
	Code,
	Image,
	List,
	Shortcode,
} from 'helpers/markdownRenderers'
import {
	a11yEmoji,
	properties,
} from 'helpers/remark'





const config = {
	allowDangerousHtml: true,
	plugins: [
		[behead, { depth: 1 }],
		a11yEmoji,
		properties,
		shortcodes,
		squeezeParagraphs,
	],
	renderers: {
		code: Code,
		image: Image,
		imageReference: Image,
		list: List,
		shortcode: Shortcode,
	},
}





export default config
