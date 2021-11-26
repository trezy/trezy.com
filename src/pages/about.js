// Module imports
import React from 'react'





// Component imports
import { ExternalLink } from 'components/ExternalLink'
import PageWrapper from 'components/PageWrapper'





export default function About() {
	return (
		<PageWrapper
			description="Trezy has been called a software engineer, a wannabe cyborg, and an international man of mystery. Learn more about the story behind the man."
			showHeader={false}
			title="About">
			<section className="block hero no-top-margin">
				<div>
					<img
						alt="Headshot of Trezy"
						className="headshot"
						data-animate
						data-animation="fade-in-from-left"
						data-animation-duration="1s"
						src="/images/casual-headshot.png" />

					<h2>
						<span
							data-animate
							data-animation="fade-in-from-top"
							data-animation-delay="0.3s"
							data-animation-duration="1s"
							style={{ display: 'inline-flex' }}>
							Hi.
						</span>
						{' '}
						<span
							data-animate
							data-animation="fade-in-from-right-small"
							data-animation-delay="1s"
							data-animation-duration="1s"
							style={{ display: 'inline-flex' }}>
							I'm Trezy.
						</span>
					</h2>

					<p
						data-animate
						data-animation="fade-in-from-bottom-small"
						data-animation-delay="1.5s"
						data-animation-duration="1s">
						I'm a software engineer and a wannabe cyborg. I was born in the flatlands of Texas, raised among the luscious forests of the Shawnee National Forest, and I eventually found my way to the rolling hills of Wisconsin. My mother bought me my first technology book, <cite><ExternalLink href="https://www.amazon.com/dp/0764585304">CliffsNotes: Creating Web Pages with HTML</ExternalLink></cite>, when I was 12 and I used it to build my very first website: a Pokémon-themed choose-your-own-adventure. I've been writing code ever since. Thanks, <ExternalLink href="https://twitter.com/ChildofKi">mom</ExternalLink>. <span aria-label="Heart emoji" role="img">❤️</span>
					</p>

					<p
						data-animate
						data-animation="fade-in-from-bottom-small"
						data-animation-delay="1.8s"
						data-animation-duration="1s">
						My web dev hobby quickly became a full-time career. I've worked on tons of <abbr title="Free Open Source Software">FOSS</abbr> that's used by hundreds of thousands of projects all over the world, and fortunate enough to work with world-renowned brands like <ExternalLink href="https://amazon.com">Amazon</ExternalLink>, <ExternalLink href="https://disney.com">Disney</ExternalLink>, <ExternalLink href="https://eventbrite.com">Eventbrite</ExternalLink>, <ExternalLink href="https://gettyimages.com">Getty Images</ExternalLink>, and <ExternalLink href="https://gopro.com">GoPro</ExternalLink>.
					</p>

					<p
						data-animate
						data-animation="fade-in-from-bottom-small"
						data-animation-delay="2.1s"
						data-animation-duration="1s">
						These days I'm a full-stack engineer looking for my next opportunity, a serial <ExternalLink href="https://github.com/trezy">open source contributor</ExternalLink>, and a regular <ExternalLink href="https://twitch.tv/TrezyCodes">live streamer</ExternalLink>. When I'm not slinging code, you can find me rock climbing, snowboarding, or spending time with my wife and two beautiful daughters in Madison, WI.
					</p>
				</div>
			</section>
		</PageWrapper>
	)
}
