// Module imports
import Link from 'next/link'





// Component imports
import PageWrapper from 'components/PageWrapper'





export default function TermsOfService() {
	return (
		<PageWrapper
			breadcrumbs={[
				['Legal', '/legal'],
				['Terms of Service', '/terms-of-service'],
			]}
			description="Terms of Service"
			title="Terms of Service">
			<section className="block">
				<h3>1. Terms</h3>

				<p>By accessing the website at <Link href="/">http://trezy.com</Link>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
			</section>

			<section className="block">
				<h3>2. Use License</h3>

				<p>Permission is granted to temporarily download one copy of the materials (information or software) on Trezy.com's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>

				<ol className="numbered">
					<li>modify or copy the materials;</li>
					<li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
					<li>attempt to decompile or reverse engineer any software contained on Trezy.com's website;</li>
					<li>remove any copyright or other proprietary notations from the materials; or</li>
					<li>transfer the materials to another person or "mirror" the materials on any other server.</li>
				</ol>

				<p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Trezy.com at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>
			</section>

			<section className="block">
				<h3>3. Disclaimer</h3>

				<p>The materials on Trezy.com's website are provided on an 'as is' basis. Trezy.com makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

				<p>Further, Trezy.com does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
			</section>

			<section className="block">
				<h3>4. Limitations</h3>

				<p>In no event shall Trezy.com or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Trezy.com's website, even if Trezy.com or a Trezy.com authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
			</section>

			<section className="block">
				<h3>5. Accuracy of materials</h3>

				<p>The materials appearing on Trezy.com's website could include technical, typographical, or photographic errors. Trezy.com does not warrant that any of the materials on its website are accurate, complete or current. Trezy.com may make changes to the materials contained on its website at any time without notice. However Trezy.com does not make any commitment to update the materials.</p>
			</section>

			<section className="block">
				<h3>6. Links</h3>

				<p>Trezy.com has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Trezy.com of the site. Use of any such linked website is at the user's own risk.</p>
			</section>

			<section className="block">
				<h3>7. Modifications</h3>

				<p>Trezy.com may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
			</section>

			<section className="block">
				<h3>8. Governing Law</h3>

				<p>These terms and conditions are governed by and construed in accordance with the laws of Wisconsin, USA and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
			</section>
		</PageWrapper>
	)
}
