// Module imports
import marked from 'marked'
import moment from 'moment'
import React from 'react'
import uuid from 'uuid/v4'





// Component imports
import PageWrapper from '../components/PageWrapper'





// Local constants
const data = [
  {
    employer: {
      name: 'Mobile Doorman',
      url: 'http://mobiledoorman.com/',
    },
    id: uuid(),
    positions: [
      {
        description: `
**Tech:** Babel, CircleCI, CodeShip, ESLint, Javascript, Nuxt.js, PostCSS, Ruby, Rails, Sass, Vue.js, Webpack`,
        id: uuid(),
        location: 'Madison, WI',
        startDate: 'February 2019',
        endDate: 'August 2019',
        title: 'Senior Software Engineer',
      },
    ],
  },

  {
    employer: {
      name: 'Roll For Guild',
      url: 'http://rollforguild.com/',
    },
    id: uuid(),
    positions: [
      {
        description: `At Roll For Guild, we're working to make it easier for tabletop roleplaying gamers to find each other. As the CTO, I lead our engineering team, vet potential engineering hires, and adjust the agile process.

**Accomplishments:**
* Launched a fully-functional social network in under 3 months
* Grew a user base of more than 400 users in less than 2 months
* Implemented processes for constant improvement of our agile workflow

**Tech:** Babel, Echarts, Elixir, Enzyme, ESLint, Javascript, Jest, Koa.js, Next.js, Phoenix, React.js, Redux.js, Webpack`,
        endDate: 'August 2018',
        id: uuid(),
        location: 'Madison, WI',
        startDate: 'October 2017',
        title: 'Chief Technology Officer (CTO)',
      },
    ],
  },

  {
    employer: {
      name: 'Freelance Software Consultant',
      url: 'http://trezy.com/',
    },
    id: uuid(),
    positions: [
      {
        description: `As a consultant, I've helped companies from all over the world take their engineering teams from dysfunctional to superior. I help companies by embedding with their engineering teams and coaching them through developing better bonds, streamlining their agile process, and better engaging with their mission.

**Tech:** Angular.js, Ansible, Babel, Backbone.js, Backbone.Marionette.js, CircleCI, Docker, ESLint, Enzyme, Express.js, Grunt, Koa.js, Javascript, Jest, Next.js, PostCSS, React.js, Redux, Sass, TravisCI, Vagrant, Webpack`,
        id: uuid(),
        location: 'Madison, WI',
        startDate: 'January 2017',
        title: 'Senior Software Engineer',
      },
    ],
  },

  {
    employer: {
      name: 'Adorable.io',
      url: 'http://adorable.io/',
    },
    id: uuid(),
    positions: [
      {
        description: `As a consultant with Adorable, I worked closely with our clients to help them architect and develop applications, as well as coaching them through the process of implementing and revising agile workflows. I also mentored junior engineers to get them up-to-speed and ready to take on full projects.

**Accomplishments:**
* Increased client's engineering team engagement by 40% by coaching them through revising their agile process

**Tech:** Alt.js, Angular.js, Babel, CircleCI, Cucumber, D3.js, Enzyme, ESLint, Express.js, Grunt, Gulp, Javascript, Jest, Koa.js, Next.js, React.js, Redux.js, TravisCI, Webpack`,
        endDate: 'February 2017',
        id: uuid(),
        location: 'Madison, WI',
        startDate: 'March 2016',
        title: 'Senior Software Engineer',
      },
    ],
  },

  {
    employer: {
      name: 'Interactive Intelligence',
      url: 'http://inin.com/',
    },
    id: uuid(),
    positions: [
      {
        description: `At Interactive Intelligence my team was building a client-side voice, video, and text messaging application. I also mentored interns and junior engineers.

**Accomplishments:**
* Developed a 98% client-side realtime video chat platform with DVR-style capabilities (recording, rewind, resync, picture-in-picture) in less than a week
* Developed a full VR prototype application in less than 2 days

**Tech:** Angular.js, Chai, Coffeescript, Ember.js, Jasmine, Javascript, Mocha, Three.js`,
        endDate: 'February 2016',
        id: uuid(),
        location: 'Madison, WI',
        startDate: 'July 2014',
        title: 'Software Engineer',
      },
    ],
  },

  {
    employer: {
      name: 'SHOPBOP | East Dane',
      url: 'http://shopbop.com/',
    },
    id: uuid(),
    positions: [
      {
        description: `My team at SHOPBOP/East Dane was tasked with maintenance of the current websites, as well as architecture and development of a new website.

**Accomplishments:**
* Developed a library for XSS protection
* Developed a library for advanced client-side form validations`,
        endDate: 'July 2014',
        id: uuid(),
        location: 'Madison, WI',
        startDate: 'February 2014',
        title: 'Front End Developer',
      },
    ],
  },

  {
    employer: {
      name: 'Great Wolf Resorts',
      url: 'http://greatwolf.com/',
    },
    id: uuid(),
    positions: [
      {
        description: `My responsibilities at Great Wolf included maintaining and upgrading the company website and working with the engineering and UX teams to develop the company style guide.

**Tech:** Drupal, Javascript, nginx, Node.js, PHP, Spine.js`,
        endDate: 'February 2014',
        id: uuid(),
        location: 'Madison, WI',
        startDate: 'September 2013',
        title: 'Web Developer II',
      },
    ],
  },

  {
    employer: {
      name: 'American Family Insurance',
      url: 'http://amfam.com/',
    },
    id: uuid(),
    positions: [
      {
        description: `In my second web developer role at AmFam, I was shifted to the Life Insurance team to build a new internal website to help gamify Life Insurance sales.

**Accomplishments:**
* Developed a REST API in VB.NET that collected data from all across the internal network
* Developed a robust gamified website complete with charts, graphs, leaderboards, and achievements

**Tech:** CSS, Javascript, raphael.js, VB.NET`,
        endDate: 'September 2013',
        id: uuid(),
        location: 'Madison, WI',
        startDate: 'April 2013',
        title: 'Web Developer II',
      },

      {
        description: `In my first web developer role at AmFam, my directive was to determine accessibility best practices. I worked with differently-abled people across the spectrum, as well as with various alternative input devices (screen readers, keyboard alternatives, voice assistants, etc), to test our application.

**Accomplishments:**
* Developed a WAI-ARIA quick reference guide
* Developed the company's first accessibility-first style guide

**Tech:** CSS, Javascript, PHP`,
        endDate: 'April 2013',
        id: uuid(),
        location: 'Madison, WI',
        startDate: 'August 2012',
        title: 'Web Developer',
      },
    ],
  },

  {
    employer: {
      name: 'ESDN',
      url: 'http://esdn.com/',
    },
    id: uuid(),
    positions: [
      {
        description: `* Participated in daily scrum, review, and retrospective meetings.
* Utilized Javascript, jQuery, and CSS to create a rich user experience.
* Took an animated client on-boarding video about the company from concept to completion.`,
        endDate: 'August 2012',
        id: uuid(),
        location: 'Janesville, WI',
        startDate: 'June 2011',
        title: 'Front End Developer',
      },
    ],
  },

  {
    employer: {
      name: 'Genesis Health Technologies',
      url: 'http://www.genesishealthtechnologies.com/',
    },
    id: uuid(),
    positions: [
      {
        description: `* Participated in weekly status meetings to present my progress and refine project goals.
* Reviewed business needs to assist the business team in delivering clear and concise goals for the website.
* Built the company's public-facing website.
* Created the company's internal site for users to review statistics collected from their GHT devices.
* Utilized Javascript, jQuery, and CSS to create a rich user experience.
* Utilized PHP and MySQL to create a robust website backend and custom CMS.`,
        id: uuid(),
        endDate: 'June 2011',
        location: 'Paducah, KY',
        startDate: 'July 2009',
        title: 'Front End Developer',
      },
    ],
  },
]





const Experience = () => (
  <PageWrapper title="Experience">
    <section className="hero">
      <div>
        <header>
          <h2>Experience</h2>
        </header>

        {/* eslint-disable-next-line no-magic-numbers */}
        <p>As a software engineer for over {moment(new Date('1 1 1999')).fromNow(true)}, I've got a pretty extensive resume. Unfortunately, hiring managers are rarely interested in long resumes. To account for that, I keep a full list of my work experience right here on my website. If you're looking for your next Front End Developer, Developer Advocate, or Accessibility Engineer, make sure to connect. <span aria-label="Grinning Emoji" role="img">😁</span></p>
      </div>
    </section>

    {data.map(datum => {
      const {
        employer,
        positions,
      } = datum

      return (
        <section key={datum.id}>
          <header>
            <h3>
              <a href={employer.url}>
                {employer.name}
              </a>
            </h3>
          </header>

          <ol>
            {positions.map(position => {
              const {
                description,
                endDate,
                location,
                startDate,
                title,
              } = position

              return (
                <li key={position.id}>
                  <h3>{title}</h3>

                  <div className="meta">
                    <span>{location}</span>
                    <span><time>{startDate}</time> - <time>{endDate || 'Present'}</time></span>
                  </div>

                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={{ __html: marked(description) }} />
                </li>
              )
            })}
          </ol>
        </section>
      )
    })}
  </PageWrapper>
)





export default Experience
