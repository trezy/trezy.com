// Module imports
import behead from 'remark-behead'
import gfm from 'remark-gfm'
import squeezeParagraphs from 'remark-squeeze-paragraphs'





// Local imports
import { Code } from 'components/Code'
import {
	Image,
	List,
} from 'helpers/markdownRenderers'





export const config = {
	remarkPlugins: [
		[behead, { depth: 1 }],
		gfm,
		squeezeParagraphs,
	],
	components: {
		code: Code,
		img: Image,
		ol: (props) => <List ordered={true} start={props.start}>{props.children}</List>,
		ul: (props) => <List ordered={false}>{props.children}</List>,
	},
}
