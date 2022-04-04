// Module imports
import { useMemo } from 'react'





// Component imports
import Employer from 'components/Experience/Employer'
import Position from 'components/Experience/Position'
import PageWrapper from 'components/PageWrapper'





// Constants
const FIRST_YEAR_AS_A_DEVELOPER = 1999





export default function Experience() {
	const yearsOfExperience = useMemo(() => {
		return new Date().getUTCFullYear() - FIRST_YEAR_AS_A_DEVELOPER
	}, [])

	return (
		<PageWrapper title="Experience">
			<section className="block hero">
				<p>Lead Software Engineer with {yearsOfExperience} of experience leading the design, development, and deployment of web applications and backend platforms with a focus on the frontend. Hands-on Technical Leader with a passion for building and empowering teams to create and implement innovative solutions that maximize functionality and usability while maintaining stability and performance.</p>
			</section>

			<Employer
				name="Trezy.com"
				url="http://trezy.com/">
				<Position
					accomplishments={[
						'Embed within 17 client engineering teams to guide, mentor, & coach staff on streamlining the SDLC through agile coaching and aligning each member of the team with the greater organizational mission to deliver the highest quality products.',
					]}
					startDate="2005"
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
				name="Lands' End"
				url="https://www.landsend.com">
				<Position
					accomplishments={[
						'Reduced developer onboarding setup time from 2 weeks to 1 day and test/deployment speed from three 15 minute non-concurrent tests to one 20 minute test by containerizing the front-end stack for 7 separate Angular apps and 1 Java app.',
						'Provided engineering mentorship to 8 engineers to grow skillsets, encourage experimentation, and increase learning opportunities.',
					]}
					startDate="2020"
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
					title="Lead Staff Software Engineer" />
			</Employer>

			<Employer
				name="Webflow"
				url="http://webflow.com/">
				<Position
					accomplishments={[
						'Re-architected the company\'s internal status tracking chatbot, Tracktastic, from a basic Slack app to an integrated API with well-architected data structures, a companion web app, and a substantially improved UX.',
						'Fixed numerous memory leaks to reduce the memory footprint to <20MB total from its previous 150MB/hour.',
						'Designed and developed a new web interface to augment the UX of Tracktastic\'s chat interface that improved tracking of team statuses by allowing managers to access, filter, and sort team updates.',
						'Improved Tracktastic response time by 300% by refactoring status tracking and transferring code from a legacy serverless deployment architecture to an internal Kubernetes deployment',
					]}
					endDate="2020"
					startDate="2019"
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
						'Reduced inbox loading times and increased field flexibility by re-architecting messaging core data structures to allow for message threads with multiple users and unlock the potential for hundreds of new features.',
						'Increased the speed of page load times by 500% by converting the frontend app from Ruby-on-Rails to Vue.js.',
						'Reduced 90% of common errors before code review by implementing Danger CI to script checks for testing.',
						'Led weekly triage meetings with up to 3 engineers and 2 QA engineers to solve 120+ high-priority bugs monthly.',
						'Eliminated $1,000 in monthly costs by transitioning the Node app build/test/deploy and Ruby-on-Rails test/deploy pipelines from CodeShip to CircleCI.',
					]}
					endDate="2019"
					startDate="2019"
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
					title="Staff Software Engineer" />
			</Employer>

			<Employer
				name="Roll For Guild"
				url="http://rollforguild.com/">
				<Position
					accomplishments={[
						'Launched a fully-functional social network in <3 months with a team of 5 engineers to connect tabletop roleplaying gamers.',
						'Secured 400+ users in <2 months and reduced deployment time by 48% by containerizing Node and Elixir infrastructure.',
					]}
					endDate="2018"
					startDate="2017"
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
				name="Adorable.io"
				url="http://adorable.io/">
				<Position
					accomplishments={[
						'Developed a web app with automated features to help photographers and illustrators upload, manage, and sell images.',
						'Created a field app in Electron for Getty Images to allow photographers to process/preload images from an SD card without an internet connection while working with the engineering manager to implement agile processes and increase productivity.',
						'Built a React Native app for Cardigan that enabled users to share their digital business cards with or without network access.',
						'Designed and developed video components in React using HEVC and HEIC tech for GoPro’s marketing websites.',
						'Provided agile coaching and engineering mentorship to 4 internal engineers to improve efficiency and grow skillsets.',
					]}
					endDate="2017"
					startDate="2016"
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
						'Developed a client-side real-time video chat platform with recording, rewind, resync, and picture-in-picture capability',
						'Developed a full VR prototype application that was integrated into existing tools with a customer-facing & an internal guide app that created guided VR experiences by matching users with CSRs through a QR code to lead interactive virtual tours.',
						'Mentored 2 junior engineers and interns on JavaScript testing landscapes, application architectures, & agile methodologies.',
					]}
					endDate="2016"
					startDate="2014"
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
						'Rebuilt and transferred the existing website to a newer AWS system for the company’s acquisition by Amazon and built a new CMS that allowed developers to customize the system and help content managers better promote products.',
						'Developed libraries and advanced client-side form validations for XSS protection.',
					]}
					endDate="2014"
					startDate="2014"
					title="Front End Developer" />
			</Employer>

			<Employer
				name="Great Wolf Resorts"
				url="http://greatwolf.com/">
				<Position
					accomplishments={[
						'Maintained and upgraded the company website by optimizing JS and CSS code to increase performance and implementing new features to drive conversion.',
						'Developed the company style guide to create brand consistency by aligning colors and imagery.',
					]}
					endDate="2014"
					startDate="2013"
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
						'Built a gamified internal website with charts, graphs, leaderboards, and achievements to drive sales team engagement.',
						'Developed a REST API in VB.NET that collected and tracked user data from the internal LDAP network and policy sales numbers for the team and individuals.',
					]}
					endDate="2013"
					startDate="2013"
					tech={[
						'CSS',
						'Javascript',
						'raphael.js',
						'VB.NET',
					]}
					title="Web Developer II" />

				<Position
					accomplishments={[
						'Developed a WAI-ARIA quick reference guide and the company\'s first accessibility-first style guide before conducting testing to identify improvements using screen readers, keyboard alternatives, and voice assistants for all internal and external apps.',
					]}
					endDate="2013"
					startDate="2012"
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
					accomplishments={[
						'Built an injectable, JavaScript eCommerce solution with JavaScript and Bash that allowed jewelry retailers to control which resellers could sell their products while providing resellers access to a full range of retailers.',
					]}
					endDate="2012"
					startDate="2011"
					title="Front End Developer" />
			</Employer>

			<Employer
				name="Genesis Health Technologies"
				url="http://www.genesishealthtechnologies.com/">
				<Position
					accomplishments={[
						'Built the company\'s public-facing website to drive brand awareness, lead generation, and customer acquisition.',
						'Created a customer-facing site for users to review a logbook of their blood glucose readings collected from their GHT devices with graphs to visualize risk levels over time.',
					]}
					endDate="2011"
					startDate="2009"
					title="Front End Developer" />
			</Employer>
		</PageWrapper>
	)
}
