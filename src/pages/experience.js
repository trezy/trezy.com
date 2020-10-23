// Module imports
import moment from 'moment'
import React from 'react'
import uuid from 'uuid/v4'





// Component imports
import MarkdownRenderer from 'components/MarkdownRenderer'
import PageWrapper from 'components/PageWrapper'





// Local constants
const data = [
	{
		employer: {
			name: 'Webflow',
			url: 'http://webflow.com/',
		},
		id: uuid(),
		positions: [
			{
				accomplishments: [
					'Rearchitected Tracktastic from the ground up',
					'Fixed numerous memory leaks, bringing the memory footprint to consistently under 20MB from its previous 150MB/hour',
					'Designed and developed a new web interface to augment the UX of Tracktastic\'s chat interface',
				],
				description: `I assumed the responsibilities of architecting and developing the company\'s internal status tracking chat bot, Tracktastic. The bot began as a hack job, described by its developer as, "a raging dumpster fire that just needed to work."

I took the bot from a very basic Slack app to an integrated API with well-architected data structures, a companion web app, and a substantially improved UX.`,
				id: uuid(),
				location: 'Madison, WI',
				startDate: 'August 2019',
				endDate: 'June 2020',
				tech: [
					'Angular.js',
					'Buildkite',
					'Docker',
					'Express.js',
					'Flow',
					'Jade/Pug',
					'JavaScript',
					'MongoDB',
					'Mongoose.js',
					'Next.js',
					'React.js',
					'Redux',
					'Sass',
					'TypeScript',
				],
				title: 'Senior Software Engineer',
			},
		],
	},

	{
		employer: {
			name: 'Mobile Doorman',
			url: 'http://mobiledoorman.com/',
		},
		id: uuid(),
		positions: [
			{
				accomplishments: [
					'Lead weekly triage meetings with engineers and QA, making our way down the list of tier 3 bug reports that nobody had been able to crack alone',
					'Rearchitected our messaging core data structures, unlocking the potential for hundreds of new features and removing the need for engineers to dance around the former monolithic constructs',
				],
				description: 'My directive at Mobile Doorman was to lead-by-example and elevate a team of very talented engineers from junior to mid-level. I accomplished this by regularly taking initiative on new projects, as well as diving into projects that had been long-neglected.',
				id: uuid(),
				location: 'Madison, WI',
				startDate: 'February 2019',
				endDate: 'August 2019',
				tech: [
					'Babel',
					'CircleCI',
					'CodeShip',
					'ESLint',
					'Javascript',
					'Next.js',
					'Nuxt.js',
					'PostCSS',
					'React.js',
					'Ruby on Rails',
					'Sass',
					'Vue.js',
					'Webpack',
				],
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
				accomplishments: [
					'Launched a fully-functional social network in under 3 months',
					'Grew a user base of more than 400 users in less than 2 months',
					'Implemented processes for constant improvement of our agile workflow',
				],
				description: 'At Roll For Guild, our goal was to make it easier for tabletop roleplaying gamers to find each other. As the CTO, I lead our engineering team, vetted potential engineering hires, and managed and tweaked our agile process.',
				endDate: 'August 2018',
				id: uuid(),
				location: 'Madison, WI',
				startDate: 'October 2017',
				tech: [
					'Babel',
					'Echarts',
					'Elixir',
					'Enzyme',
					'ESLint',
					'Javascript',
					'Jest',
					'Koa.js',
					'Next.js',
					'Phoenix',
					'React.js',
					'Redux.js',
					'Webpack',
				],
				title: 'Chief Technology Officer',
			},
		],
	},

	{
		employer: {
			name: 'Trezy.com',
			url: 'http://trezy.com/',
		},
		id: uuid(),
		positions: [
			{
				accomplishments: [],
				description: 'As a consultant, I\'ve helped companies from all over the world take their engineering teams from dysfunctional to superior. I help companies by embedding with their engineering teams and coaching them through developing better bonds, streamlining their agile process, and better engaging with their mission.',
				id: uuid(),
				location: 'Madison, WI',
				startDate: 'January 2017',
				tech: [
					'Angular.js',
					'Ansible',
					'Babel',
					'Backbone.js',
					'Backbone.Marionette.js',
					'CircleCI',
					'Docker',
					'ESLint',
					'Enzyme',
					'Express.js',
					'Grunt',
					'Koa.js',
					'Javascript',
					'Jest',
					'Next.js',
					'PostCSS',
					'React.js',
					'Redux',
					'Sass',
					'TravisCI',
					'Vagrant',
					'Webpack',
				],
				title: 'Software Engineering Consultant',
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
				accomplishments: [
					'Increased client\'s engineering team engagement by 40% by coaching them through revising their agile process (measured by post-contract employee survey)',
				],
				description: 'As a consultant with Adorable, I worked closely with our clients to help them architect and develop applications, as well as coaching them through the process of implementing and revising agile workflows. I also mentored junior engineers to get them up-to-speed and ready to take on full projects.',
				endDate: 'February 2017',
				id: uuid(),
				location: 'Madison, WI',
				startDate: 'March 2016',
				tech: [
					'Alt.js',
					'Angular.js',
					'Babel',
					'CircleCI',
					'Cucumber',
					'D3.js',
					'Enzyme',
					'ESLint',
					'Express.js',
					'Grunt',
					'Gulp',
					'Javascript',
					'Jest',
					'Koa.js',
					'Next.js',
					'React.js',
					'Redux.js',
					'TravisCI',
					'Webpack',
				],
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
				accomplishments: [
					'Developed a 98% client-side realtime video chat platform with DVR-style capabilities (recording, rewind, resync, picture-in-picture) in less than a week',
					'Developed a full VR prototype application in less than 2 days',
				],
				description: 'At Interactive Intelligence my team was building a client-side voice, video, and text messaging application. I also mentored interns and junior engineers.',
				endDate: 'February 2016',
				id: uuid(),
				location: 'Madison, WI',
				startDate: 'July 2014',
				tech: [
					'Angular.js',
					'Chai',
					'Coffeescript',
					'Ember.js',
					'Jasmine',
					'Javascript',
					'Mocha',
					'Three.js',
				],
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
				accomplishments: [
					'Developed a library for XSS protection',
					'Developed a library for advanced client-side form validations',
				],
				description: 'My team at SHOPBOP/East Dane was tasked with maintenance of the current websites, as well as architecture and development of a new website.',
				endDate: 'July 2014',
				id: uuid(),
				location: 'Madison, WI',
				startDate: 'February 2014',
				tech: [],
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
				accomplishments: [],
				description: 'My responsibilities at Great Wolf included maintaining and upgrading the company website and working with the engineering and UX teams to develop the company style guide.',
				endDate: 'February 2014',
				id: uuid(),
				location: 'Madison, WI',
				startDate: 'September 2013',
				tech: [
					'Drupal',
					'Javascript',
					'nginx',
					'Node.js',
					'PHP',
					'Spine.js',
				],
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
				accomplishments: [
					'Developed a REST API in VB.NET that collected data from all across the internal network',
					'Developed a robust gamified website complete with charts, graphs, leaderboards, and achievements',
				],
				description: 'On the Life Insurance team, I built an internal website to help gamify Life Insurance sales.',
				endDate: 'September 2013',
				id: uuid(),
				location: 'Madison, WI',
				startDate: 'April 2013',
				tech: [
					'CSS',
					'Javascript',
					'raphael.js',
					'VB.NET',
				],
				title: 'Web Developer II',
			},

			{
				accomplishments: [
					'Developed a WAI-ARIA quick reference guide',
					'Developed the company\'s first accessibility-first style guide',
				],
				description: 'At AmFam, my directive was to determine accessibility best practices. I worked with differently-abled people across the spectrum, as well as with various alternative input devices (screen readers, keyboard alternatives, voice assistants, etc), to test our application.',
				endDate: 'April 2013',
				id: uuid(),
				location: 'Madison, WI',
				startDate: 'August 2012',
				tech: [
					'CSS',
					'Javascript',
					'PHP',
				],
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
				accomplishments: [],
				description: `* Participated in daily scrum, review, and retrospective meetings.
* Utilized Javascript, jQuery, and CSS to create a rich user experience.
* Took an animated client on-boarding video about the company from concept to completion.`,
				endDate: 'August 2012',
				id: uuid(),
				location: 'Janesville, WI',
				startDate: 'June 2011',
				tech: [],
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
				accomplishments: [],
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
				tech: [],
				title: 'Front End Developer',
			},
		],
	},
]





export default function Experience() {
	return (
		<PageWrapper title="Experience">
			<section className="hero">
				<div>
					<header>
						<h2>Experience</h2>
					</header>

					{/* eslint-disable-next-line no-magic-numbers */}
					<p>As a software engineer for over {moment(new Date('January 1, 1999')).fromNow(true)}, I've got an extensive resume. However, not everybody wants to spend hours catching up on my career. Instead, I keep a full list of my work experience right here on my website. If you're looking for your next Front End Developer, Developer Advocate, or Accessibility Engineer, make sure to connect. <span aria-label="Grinning face emoji" role="img">😁</span></p>
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
									accomplishments,
									endDate,
									location,
									startDate,
									tech,
									title,
								} = position

								let { description } = position

								if (accomplishments?.length) {
									if (description) {
										description += '\n\n'
									}

									description += `**Accomplishments:**\n* ${accomplishments.join('\n* ')}`
								}

								if (tech?.length) {
									if (description) {
										description += '\n\n'
									}

									description += `**Tech:** ${tech.join(', ')}`
								}

								return (
									<li key={position.id}>
										<h4>{title}</h4>

										<div className="meta">
											<span>{location}</span>
											<span><time>{startDate}</time> - <time>{endDate || 'Present'}</time></span>
										</div>

										<MarkdownRenderer source={description} />
									</li>
								)
							})}
						</ol>
					</section>
				)
			})}
		</PageWrapper>
	)
}
