// Module imports
import PropTypes from 'prop-types'





// Local imports
import { ExternalLink } from 'components/ExternalLink'

import AmazonSVG from 'public/images/logos/amazon.svg'
import AmfamSVG from 'public/images/logos/amfam.svg'
import DisneySVG from 'public/images/logos/disney.svg'
import EventbriteSVG from 'public/images/logos/eventbrite.svg'
import GettyImagesSVG from 'public/images/logos/getty-images.svg'
import GoproSVG from 'public/images/logos/gopro.svg'
import GreatWolfSVG from 'public/images/logos/great-wolf.svg'
import GenesysSVG from 'public/images/logos/genesys.svg'
import LandsEndSVG from 'public/images/logos/lands-end.svg'
import MarvelSVG from 'public/images/logos/marvel.svg'
import MobileDoormanSVG from 'public/images/logos/mobile-doorman.svg'
import MoxeSVG from 'public/images/logos/moxe.svg'
import SkybellSVG from 'public/images/logos/skybell.svg'
import WebflowSVG from 'public/images/logos/webflow.svg'





function Client(props) {
	const {
		children,
		name,
		url,
	} = props

	return (
		<li key={name}>
			<ExternalLink href={url}>
				{children}

				<span className="screen-reader-only">
					{name}
				</span>
			</ExternalLink>
		</li>
	)
}

Client.propTypes = {
	children: PropTypes.node.isRequired,
	name: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
}





export function ClientList() {
	return (
		<ul className="client-list">
			<Client
				name="Amazon"
				url="https://amazon.com">
				<AmazonSVG />
			</Client>

			<Client
				name="American Family Insurance"
				url="https://amfam.com">
				<AmfamSVG />
			</Client>

			<Client
				name="Disney"
				url="https://disney.com">
				<DisneySVG />
			</Client>

			<Client
				name="Eventbrite"
				url="https://eventbrite.com">
				<EventbriteSVG />
			</Client>

			<Client
				name="Getty Images"
				url="https://gettyimages.com">
				<GettyImagesSVG />
			</Client>

			<Client
				name="GoPro"
				url="https://gopro.com">
				<GoproSVG />
			</Client>

			<Client
				name="Great Wolf Lodge"
				url="https://greatwolf.com">
				<GreatWolfSVG />
			</Client>

			<Client
				name="Genesys"
				url="https://genesys.com">
				<GenesysSVG />
			</Client>

			<Client
				name="Lands\' End"
				url="https://www.landsend.com/">
				<LandsEndSVG />
			</Client>

			<Client
				name="Marvel"
				url="https://marvel.com">
				<MarvelSVG />
			</Client>

			<Client
				name="Mobile Doorman"
				url="https://mobiledoorman.com">
				<MobileDoormanSVG />
			</Client>

			<Client
				name="Moxe Health"
				url="https://moxehealth.com">
				<MoxeSVG />
			</Client>

			<Client
				name="SkyBell"
				url="https://skybell.com">
				<SkybellSVG />
			</Client>

			<Client
				name="Webflow"
				url="https://webflow.com">
				<WebflowSVG />
			</Client>
		</ul>
	)
}
