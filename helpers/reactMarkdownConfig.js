// Module imports
import behead from 'remark-behead'
import shortcodes from 'remark-shortcodes'





// Local imports
import {
  List,
  Shortcode,
} from './markdownRenderers'





const config = {
  plugins: [
    [behead, { depth: 1 }],
    shortcodes,
  ],
  renderers: {
    list: List,
    shortcode: Shortcode,
  },
}





export default config
