// Module imports
import React from 'react'





// Component imports
import { ExternalLink } from 'components/ExternalLink'
import PageWrapper from 'components/PageWrapper'





export default function CodeOfConduct() {
	return (
		<PageWrapper
			breadcrumbs={[
				['Legal', '/legal'],
				['Code of Conduct', '/code-of-conduct'],
			]}
			description="TL;DR: Don't be a butthole and everything's cool."
			title="Code of Conduct">
			<section className="block">
				<p><em>Based on the CoC of <ExternalLink href="https://hackandtell.org/">Hack &amp;&amp; Tell</ExternalLink></em></p>

				<p>This document governs the conduct that is expected of <strong>all participants</strong> on <strong>all Trezy.com properties</strong>. This includes, but is not limited to:</p>

				<ul className="bulleted">
					<li>articles submitted to Trezy.com;</li>
					<li>responses to articles on Trezy.com;</li>
					<li>chat messages on Trezy.com, even in private conversations; and</li>
					<li>chat messages in the <ExternalLink href="https://twitch.tv/TrezyCodes">Trezy Studios Discord server</ExternalLink>.</li>
				</ul>

				<p>I want my communities to be fun, safe, and welcoming for everyone. Because we all come from different backgrounds, I want to be concrete about what sorts of behaviors jeopardize the warmth of these communities and are therefore unacceptable.</p>
			</section>

			<section className="block">
				<h3>Social Rules</h3>

				<p>An important part of removing obstacles to a great community is having a small set of social rules. These are originally forked from <ExternalLink href="https://www.recurse.com/">The Recurse Center’s</ExternalLink> manual:</p>

				<ul className="bulleted">
					<li>No feigning surprise.</li>
					<li>No well-actually’s.</li>
					<li>No subtle -isms.</li>
				</ul>

				<p>Subtle -isms are small things that make others feel uncomfortable, things that we all sometimes do by mistake. For example, saying <em>"It's so easy my grandmother could do it"</em> is a subtle -ism. Like the other three social rules, this one is often accidentally broken. Like the other three, it's not a big deal to mess up — you just apologize and move on.</p>
			</section>

			<section className="block">
				<h3>Harassment</h3>

				<p>I do not tolerate harassment in any form.</p>

				<h4>Reporting</h4>

				<p>If you are being harassed, notice that someone else is being harassed, or have any other concerns, please contact me or one of my moderators immediately (either message one of us in chat, or send an email to <ExternalLink href="mailto:harassment@trezy.com">harassment@trezy.com</ExternalLink>). You do <em>not</em> need to be the target of harassment to speak up. Making this the best possible community is everyone's responsibility.</p>

				<p>If an incident is reported during my stream, the moderators will be happy to help participants contact the appropriate platform and/or local law enforcement, or otherwise assist those experiencing harassment to feel safe for the duration of the stream.</p>

				<p>We will respect confidentiality requests for the purpose of protecting victims of abuse. At our discretion, we may publicly name a person about whom we’ve received harassment complaints, or privately warn third parties about them, if we believe that doing so will increase the safety of my communities or the general public. I will not name harassment victims without their affirmative consent.</p>

				<h4>Consequences</h4>

				<p>Users asked to stop any harassing behavior are expected to comply immediately.</p>

				<p>If a user engages in harassing behavior, the moderators may take any action they deem appropriate, up to and including expulsion from all facets of my community and identification of the user as a harasser to members of my community and/or the general public.</p>
			</section>
		</PageWrapper>
	)
}
