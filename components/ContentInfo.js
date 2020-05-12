// Module imports
import Link from 'next/link'
import React from 'react'





// Local imports
import SocialNav from './SocialNav'





const ContentInfo = () => (
  <footer role="contentinfo">
    <nav
      className="trezy"
      aria-labelledby="contentinfo-trezy-header">
      <header id="contentinfo-trezy-header">
        Trezy
      </header>

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
    </nav>

    <nav
      className="account"
      aria-labelledby="contentinfo-account-header">
      <header id="contentinfo-account-header">
        Account
      </header>

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
    </nav>

    <nav
      className="resources"
      aria-labelledby="contentinfo-resources-header">
      <header id="contentinfo-resources-header">
        Resources
      </header>

      <ul>
        <li>
          <Link href="/terms-of-service">
            <a>Terms of Service</a>
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
    </nav>

    <SocialNav />
  </footer>
)





export default ContentInfo
