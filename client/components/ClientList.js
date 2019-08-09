// Module imports
import React from 'react'
import SVG from 'react-svg-inline'





// Local constants
const clients = [
  {
    logo: 'amazon.svg',
    name: 'Amazon',
    url: 'https://amazon.com',
  },
  {
    logo: 'amfam.svg',
    name: 'American Family Insurance',
    url: 'https://amfam.com',
  },
  {
    logo: 'disney.svg',
    name: 'Disney',
    url: 'https://disney.com',
  },
  {
    logo: 'eventbrite.svg',
    name: 'Eventbrite',
    url: 'https://eventbrite.com',
  },
  {
    logo: 'getty-images.svg',
    name: 'Getty Images',
    url: 'https://gettyimages.com',
  },
  {
    logo: 'gopro.svg',
    name: 'GoPro',
    url: 'https://gopro.com',
  },
  {
    logo: 'great-wolf.svg',
    name: 'Great Wolf Lodge',
    url: 'https://greatwolf.com',
  },
  {
    logo: 'genesys.svg',
    name: 'Genesys',
    url: 'https://genesys.com',
  },
  {
    logo: 'marvel.svg',
    name: 'Marvel',
    url: 'https://marvel.com',
  },
  {
    logo: 'mobile-doorman.svg',
    name: 'Mobile Doorman',
    url: 'https://mobiledoorman.com',
  },
  {
    logo: 'moxe.svg',
    name: 'Moxe Health',
    url: 'https://moxehealth.com',
  },
  {
    logo: 'skybell.svg',
    name: 'SkyBell',
    url: 'https://skybell.com',
  },
].map(client => ({
  ...client,
  logo: require(`../static/images/logos/${client.logo}`).default, // eslint-disable-line global-require,import/no-dynamic-require
}))





const ClientList = () => (
  <ul className="client-list">
    {clients.map(({ logo, name, url }) => (
      <li key={name}>
        <a href={url}>
          {/* eslint-disable-next-line react/jsx-pascal-case */}
          <SVG
            accessibilityLabel={`Logo for ${name}`}
            className="amazon logo"
            cleanup
            component="div"
            svg={logo} />

          <span className="screen-reader-only">
            {name}
          </span>
        </a>
      </li>
    ))}
  </ul>
)





export default ClientList
