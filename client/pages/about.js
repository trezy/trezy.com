// Module imports
import React from 'react'





// Component imports
import PageWrapper from '../components/PageWrapper'





const About = () => (
  <PageWrapper title="About">
    <section className="hero">
      <div>
        <img
          alt="Headshot of Trezy"
          className="headshot"
          data-animate
          data-animation="fade-in-from-left"
          data-animation-duration="1s"
          src="/static/casual-headshot.png" />

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
            I'm a software engineer and a wannabe cyborg. I was born in the flatlands of Texas, raised among the luscious forests of the Shawnee National Forest, and I eventually found my way to the rolling hills of Wisconsin. My mother bought me my first technology book, <cite><a href="https://www.amazon.com/dp/0764585304">CliffsNotes: Creating Web Pages with HTML</a></cite>, when I was 12 and I used it to build my very first Pokémon-based choose-your-own-adventure website. I've been writing code ever since. Thanks, <a href="https://twitter.com/ChildofKi">mom</a>. <span aria-label="Heart emoji" role="img">❤️</span>
        </p>

        <p
          data-animate
          data-animation="fade-in-from-bottom-small"
          data-animation-delay="1.8s"
          data-animation-duration="1s">
          My web dev hobby quickly became a full-time career. I've been involved with a handful of <abbr title="Free Open Source Software">FOSS</abbr> projects used by hundreds of thousands of projects all over the world, and fortunate enough to work with world-renowned brands like <a href="https://amazon.com">Amazon</a>, <a href="https://disney.com">Disney</a>, <a href="https://eventbrite.com">Eventbrite</a>, <a href="https://gettyimages.com">Getty Images</a>, and <a href="https://gopro.com">GoPro</a>.
        </p>

        <p
          data-animate
          data-animation="fade-in-from-bottom-small"
          data-animation-delay="2.1s"
          data-animation-duration="1s">
          These days I'm a full-stack engineer for <a href="https://mobiledoorman.com">Mobile Doorman</a>, a serial <a href="https://github.com/trezy">open source contributor</a>, and a regular <a href="https://twitch.tv/TrezyCodes">live streamer</a>. When I'm not slinging code, you can find me rock climbing, snowboarding, or spending time with my wife and two beautiful daughters in Madison, WI.
        </p>
      </div>
    </section>
  </PageWrapper>
)





export default About
