// Module imports
import Link from 'next/link'
import React from 'react'





// Local imports
import SocialNav from './SocialNav'





const ContentInfo = () => (
  <footer role="contentinfo">
    <div className="trezy">
      <header>Trezy</header>

      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>

        <li>
          <Link href="/about">
            <a>About</a>
          </Link>
        </li>

        <li>
          <Link href="/blog">
            <a>Blog</a>
          </Link>
        </li>

        <li>
          <Link href="/uses">
            <a>/uses</a>
          </Link>
        </li>
      </ul>
    </div>

    <div className="account">
      <header>Account</header>

      <ul>
        <li>
          <Link href="/profile">
            <a>My Profile</a>
          </Link>
        </li>

        <li>
          <Link href="/profile">
            <a>My Articles</a>
          </Link>
        </li>
      </ul>
    </div>

    <div className="resources">
      <header>Resources</header>

      <ul>
        <li>
          <Link href="/terms-of-use">
            <a>Terms of Use</a>
          </Link>
        </li>

        <li>
          <Link href="/privacy-policy">
            <a>Privacy Policy</a>
          </Link>
        </li>

        <li>
          <Link href="/privacy-policy">
            <a>Cookie Policy</a>
          </Link>
        </li>
      </ul>
    </div>

    <SocialNav />
  </footer>
)





export default ContentInfo
