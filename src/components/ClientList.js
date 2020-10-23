// Module imports
import React from 'react'





// Local imports
import ExternalLink from 'components/ExternalLink'

import AmazonSVG from 'public/images/logos/amazon.svg'
import AmfamSVG from 'public/images/logos/amfam.svg'
import DisneySVG from 'public/images/logos/disney.svg'
import EventbriteSVG from 'public/images/logos/eventbrite.svg'
import GettyImagesSVG from 'public/images/logos/getty-images.svg'
import GoproSVG from 'public/images/logos/gopro.svg'
import GreatWolfSVG from 'public/images/logos/great-wolf.svg'
import GenesysSVG from 'public/images/logos/genesys.svg'
import MarvelSVG from 'public/images/logos/marvel.svg'
import MobileDoormanSVG from 'public/images/logos/mobile-doorman.svg'
import MoxeSVG from 'public/images/logos/moxe.svg'
import SkybellSVG from 'public/images/logos/skybell.svg'
import WebflowSVG from 'public/images/logos/webflow.svg'





// Local constants
const clients = [
	{
		component: <AmazonSVG />,
		name: 'Amazon',
		url: 'https://amazon.com',
	},
	{
		component: <AmfamSVG />,
		name: 'American Family Insurance',
		url: 'https://amfam.com',
	},
	{
		component: <DisneySVG />,
		name: 'Disney',
		url: 'https://disney.com',
	},
	{
		component: <EventbriteSVG />,
		name: 'Eventbrite',
		url: 'https://eventbrite.com',
	},
	{
		component: <GettyImagesSVG />,
		name: 'Getty Images',
		url: 'https://gettyimages.com',
	},
	{
		component: <GoproSVG />,
		name: 'GoPro',
		url: 'https://gopro.com',
	},
	{
		component: <GreatWolfSVG />,
		name: 'Great Wolf Lodge',
		url: 'https://greatwolf.com',
	},
	{
		component: <GenesysSVG />,
		name: 'Genesys',
		url: 'https://genesys.com',
	},
	{
		component: <MarvelSVG />,
		name: 'Marvel',
		url: 'https://marvel.com',
	},
	{
		component: <MobileDoormanSVG />,
		name: 'Mobile Doorman',
		url: 'https://mobiledoorman.com',
	},
	{
		component: <MoxeSVG />,
		name: 'Moxe Health',
		url: 'https://moxehealth.com',
	},
	{
		component: <SkybellSVG />,
		name: 'SkyBell',
		url: 'https://skybell.com',
	},
	{
		component: <WebflowSVG />,
		name: 'Webflow',
		url: 'https://webflow.com',
	},
]





const ClientList = () => (
	<ul className="client-list">
		{clients.map(({ component, name, url }) => (
			<li key={name}>
				<ExternalLink href={url}>
					{component}

					<span className="screen-reader-only">
						{name}
					</span>
				</ExternalLink>
			</li>
		))}
	</ul>
)





export default ClientList
