// Module imports
import moment from 'moment'





// Component imports
import Employer from 'components/Experience/Employer'
import Position from 'components/Experience/Position'
import PageWrapper from 'components/PageWrapper'





export default function Experience() {
	return (
		<PageWrapper title="Experience">
			<section className="block hero">
				{/* eslint-disable-next-line no-magic-numbers */}
				<p>As a software engineer for over {moment(new Date('January 1, 1999')).fromNow(true)}, I've got an extensive resume. However, not everybody wants to spend hours catching up on my career. Instead, I keep a full list of my work experience right here on my website. If you're looking for your next Front End Developer, Developer Advocate, or Accessibility Engineer, make sure to connect. <span aria-label="Grinning face emoji" role="img">😁</span></p>
			</section>

			<Employer
				name="Lands' End"
				url="https://www.landsend.com">
				<Position
					accomplishments={[
						"Containerize our front-end stack, including 7 separate Angular apps and 1 Java app",
						"Improved Developer Experience and test/deployment speed by refactoring front-end stack from 7 repos to a single monorepo",
					]}
					description=""
					startDate="August 2020"
					tech={[
						'Angular 7',
						'Apollo',
						'Docker',
						'GraphQL',
						'Grunt',
						'Jest',
						'NgRx',
						'Rx.js',
						'Storybook',
						'TypeScript',
					]}
					title="Staff Front End Engineer, Lead" />
			</Employer>

			<Employer
				name="Webflow"
				url="http://webflow.com/">
				<Position
					accomplishments={[
						'Rearchitected Tracktastic from the ground up',
						'Fixed numerous memory leaks, bringing the memory footprint to consistently under 20MB from its previous 150MB/hour',
						'Designed and developed a new web interface to augment the UX of Tracktastic\'s chat interface',
					]}
					description={`I assumed the responsibilities of architecting and developing the company\'s internal status tracking chat bot, Tracktastic. The bot began as a hack job, described by its developer as, "a raging dumpster fire that just needed to work."

I took the bot from a very basic Slack app to an integrated API with well-architected data structures, a companion web app, and a substantially improved UX.`}
					endDate="June 2020"
					startDate="August 2019"
					tech={[
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
					]}
					title="Senior Software Engineer" />
			</Employer>

			<Employer
				name="Mobile Doorman"
				url="http://mobiledoorman.com/">
				<Position
					accomplishments={[
						'Lead weekly triage meetings with engineers and QA, making our way down the list of tier 3 bug reports that nobody had been able to crack alone',
						'Rearchitected our messaging core data structures, unlocking the potential for hundreds of new features and removing the need for engineers to dance around the former monolithic constructs',
					]}
					description="My directive at Mobile Doorman was to lead-by-example and elevate a team of very talented engineers from junior to mid-level. I accomplished this by regularly taking initiative on new projects, as well as diving into projects that had been long-neglected."
					endDate="August 2019"
					startDate="February 2019"
					tech={[
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
					]}
					title="Senior Software Engineer" />
			</Employer>

			<Employer
				name="Roll For Guild"
				url="http://rollforguild.com/">
				<Position
					accomplishments={[
						'Launched a fully-functional social network in under 3 months',
						'Grew a user base of more than 400 users in less than 2 months',
						'Implemented processes for constant improvement of our agile workflow',
					]}
					description="At Roll For Guild, our goal was to make it easier for tabletop roleplaying gamers to find each other. As the CTO, I lead our engineering team, vetted potential engineering hires, and managed and tweaked our agile process."
					endDate="August 2018"
					startDate="October 2017"
					tech={[
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
					]}
					title="Chief Technology Officer" />
			</Employer>

			<Employer
				name="Trezy.com"
				url="http://trezy.com/">
				<Position
					description="As a consultant, I\'ve helped companies from all over the world take their engineering teams from dysfunctional to superior. I help companies by embedding with their engineering teams and coaching them through developing better bonds, streamlining their agile process, and better engaging with their mission."
					startDate="January 2017"
					tech={[
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
					]}
					title="Software Engineering Consultant" />
			</Employer>

			<Employer
				name="Adorable.io"
				url="http://adorable.io/">
				<Position
					accomplishments={[
						'Increased client\'s engineering team engagement by 40% by coaching them through revising their agile process (measured by post-contract employee survey)',
					]}
					description="As a consultant with Adorable, I worked closely with our clients to help them architect and develop applications, as well as coaching them through the process of implementing and revising agile workflows. I also mentored junior engineers to get them up-to-speed and ready to take on full projects."
					endDate="February 2017"
					startDate="March 2016"
					tech={[
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
					]}
					title="Senior Software Engineer" />
			</Employer>

			<Employer
				name="Interactive Intelligence"
				url="http://inin.com/">
				<Position
					accomplishments={[
						'Developed a 98% client-side realtime video chat platform with DVR-style capabilities (recording, rewind, resync, picture-in-picture) in less than a week',
						'Developed a full VR prototype application in less than 2 days',
					]}
					description="At Interactive Intelligence my team was building a client-side voice, video, and text messaging application. I also mentored interns and junior engineers."
					endDate="February 2016"
					startDate="July 2014"
					tech={[
						'Angular.js',
						'Chai',
						'Coffeescript',
						'Ember.js',
						'Jasmine',
						'Javascript',
						'Mocha',
						'Three.js',
					]}
					title="Software Engineer" />
			</Employer>

			<Employer
				name="SHOPBOP | East Dane"
				url="http://shopbop.com/">
				<Position
					accomplishments={[
						'Developed a library for XSS protection',
						'Developed a library for advanced client-side form validations',
					]}
					description="My team at SHOPBOP/East Dane was tasked with maintenance of the current websites, as well as architecture and development of a new website."
					endDate="July 2014"
					startDate="February 2014"
					title="Front End Developer" />
			</Employer>

			<Employer
				name="Great Wolf Resorts"
				url="http://greatwolf.com/">
				<Position
					description="My responsibilities at Great Wolf included maintaining and upgrading the company website and working with the engineering and UX teams to develop the company style guide."
					endDate="February 2014"
					startDate="September 2013"
					tech={[
						'Drupal',
						'Javascript',
						'nginx',
						'Node.js',
						'PHP',
						'Spine.js',
					]}
					title="Web Developer II" />
			</Employer>

			<Employer
				name="American Family Insurance"
				url="http://amfam.com/">
				<Position
					accomplishments={[
						'Developed a REST API in VB.NET that collected data from all across the internal network',
						'Developed a robust gamified website complete with charts, graphs, leaderboards, and achievements',
					]}
					description="On the Life Insurance team, I built an internal website to help gamify Life Insurance sales."
					endDate="September 2013"
					startDate="April 2013"
					tech={[
						'CSS',
						'Javascript',
						'raphael.js',
						'VB.NET',
					]}
					title="Web Developer II" />

				<Position
					accomplishments={[
						'Developed a WAI-ARIA quick reference guide',
						'Developed the company\'s first accessibility-first style guide',
					]}
					description="At AmFam, my directive was to determine accessibility best practices. I worked with differently-abled people across the spectrum, as well as with various alternative input devices (screen readers, keyboard alternatives, voice assistants, etc), to test our application."
					endDate="April 2013"
					startDate="August 2012"
					tech={[
						'CSS',
						'Javascript',
						'PHP',
					]}
					title="Web Developer" />
			</Employer>

			<Employer
				name="ESDN"
				url="http://esdn.com/">
				<Position
					description={`* Participated in daily scrum, review, and retrospective meetings.
	* Utilized Javascript, jQuery, and CSS to create a rich user experience.
	* Took an animated client on-boarding video about the company from concept to completion.`}
					endDate="August 2012"
					startDate="June 2011"
					title="Front End Developer" />
			</Employer>

			<Employer
				name="Genesis Health Technologies"
				url="http://www.genesishealthtechnologies.com/">
				<Position
					description={`* Participated in weekly status meetings to present my progress and refine project goals.
	* Reviewed business needs to assist the business team in delivering clear and concise goals for the website.
	* Built the company's public-facing website.
	* Created the company's internal site for users to review statistics collected from their GHT devices.
	* Utilized Javascript, jQuery, and CSS to create a rich user experience.
	* Utilized PHP and MySQL to create a robust website backend and custom CMS.`}
					endDate="June 2011"
					startDate="July 2009"
					title="Front End Developer" />
			</Employer>
		</PageWrapper>
	)
}
