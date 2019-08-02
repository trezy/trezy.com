/* globals
     $BUILD_BRANCH:false
     $BUILD_COMMIT_HASH:false
     $BUILD_DATE:false
     $BUILD_ID:false
     $NODE_VERSION:false
     $NEXT_BUILD_ID:false
*/

// Module imports
import React from 'react'
import moment from 'moment'




// Component imports
import { version } from '../../package.json'
import PageWrapper from '../components/PageWrapper'




// Component Constants
const BUILD_BRANCH = $BUILD_BRANCH
const BUILD_COMMIT_HASH = $BUILD_COMMIT_HASH
const BUILD_COMMIT_RANGE = $BUILD_COMMIT_RANGE
const BUILD_DATE = $BUILD_DATE
const BUILD_ID = $BUILD_ID
const NODE_VERSION = $NODE_VERSION
const NEXT_BUILD_ID = $NEXT_BUILD_ID




const Version = () => (
  <PageWrapper title="Version Information" renderHeader={false}>
    <section className="hero">
      <table>
        <tbody>
          <tr>
            <th>App Version</th>

            <td>
              <a target="_blank" rel="noopener noreferrer" href={`https://github.com/trezy/trezy.com/releases/tag/v${version}`}>
                v{version}
              </a>
            </td>
          </tr>

          <tr>
            <th>Built On</th>

            <td>
              <a target="_blank" rel="noopener noreferrer" href={`https://circleci.com/trezy/trezy.com/builds${BUILD_ID ? `/${BUILD_ID}` : ''}`}>
                <time dateTime={BUILD_DATE}>{moment.utc(BUILD_DATE).format('MMMM Do YYYY, hh:mm z')}</time>
              </a>
            </td>
          </tr>

          <tr>
            <th>Branch</th>

            <td>
              <a target="_blank" rel="noopener noreferrer" href={`https://github.com/trezy/trezy.com/tree/${BUILD_BRANCH}`}>
                {BUILD_BRANCH}
              </a>
            </td>
          </tr>

          {/* <tr>
            <th>Commit</th>

            <td>
              <a target="_blank" rel="noopener noreferrer" href={`https://github.com/trezy/trezy.com${BUILD_COMMIT_RANGE ? `/compare/${BUILD_COMMIT_RANGE}` : ''}`}>
                {BUILD_COMMIT_HASH || 'null'}
              </a>
            </td>
          </tr> */}

          <tr>
            <th>Node Version</th>

            <td>
              <a target="_blank" rel="noopener noreferrer" href={`https://github.com/nodejs/node/releases/tag/${NODE_VERSION}`}>
                {NODE_VERSION}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </PageWrapper>
)

Version.getInitialProps = ({ query, res }) => {
  if (query.raw === 'raw') {
    res.setHeader('Content-Type', 'application/vnd.api+json')
    res.end(JSON.stringify({
      data: {
        id: NEXT_BUILD_ID,
        type: 'frWebMetadata',
        attributes: {
          version: `v${version}`,
          buildDate: BUILD_DATE,
          buildBranch: BUILD_BRANCH || 'develop',
          buildCommit: BUILD_COMMIT_HASH || null,
          nodeVersion: NODE_VERSION,
        },
      },
    }))
  }

  return {}
}





export default Version
