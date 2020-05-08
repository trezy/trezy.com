// Module imports
import behead from 'remark-behead'
import shortcodes from 'remark-shortcodes'





// Local imports
import {
  Code,
  Image,
  List,
  Shortcode,
} from './markdownRenderers'





const config = {
  plugins: [
    [behead, { depth: 1 }],
    shortcodes,
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
