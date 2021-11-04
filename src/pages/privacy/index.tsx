import { Box, Typography, Link, useTheme } from '@material-ui/core'
import React from 'react'

import { StyledArticleBody } from '@/configs/theme/articletext'
import { sessionIdStore } from '@/store/sessionIdStore'

export default function PrivacyPolicy() {
  const theme = useTheme()

  const sessionId = sessionIdStore.sessionId
  const reportProblemLink = `https://airtable.com/shruwAAfn1763TgMU?prefill_Session_ID=${sessionId}`

  return (
    <Box marginTop={4} marginBottom={4}>
      <Box sx={{ p: 4, maxWidth: '720px', margin: 'auto' }}>
        <Typography variant="h1">Privacy Policy</Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          1. Information we collect
        </Typography>
        <Typography variant="h6" component="h3" gutterBottom>
          1.1 Information you provide to us
        </Typography>
        <StyledArticleBody variant="body1">When you log in with Google, we collect your</StyledArticleBody>
        <ul>
          <li>Name</li>
          <li>Google User ID</li>
          <li>Google Drive App Data (Only the data associated with this app such as your course schedule) </li>
        </ul>
        <Typography variant="h6" component="h3" gutterBottom>
          1.2 Information we collect automatically
        </Typography>
        <StyledArticleBody variant="body1">
          When you use our website, we collect your interactions with the website, which includes
        </StyledArticleBody>
        <ul>
          <li>
            Device ID (associated with the browser that you use and can be renewed by clearing the browser&apos;s local
            storage)
          </li>
          <li>Search query</li>
          <li>Click interaction</li>
          <li>Page visit</li>
          <li>Google User ID</li>
          <li>Courses you selected</li>
          <li>IP address</li>
          <li>User agent</li>
        </ul>
        <StyledArticleBody variant="body1" paragraph>
          When you submit the feedback form, the above information will be included in the submission if you provide the
          Session ID.
        </StyledArticleBody>
        <Typography variant="h6" component="h3" gutterBottom>
          1.3 Third-Party Information
        </Typography>

        <StyledArticleBody variant="body1">
          We use third-party services to collect your interactions with the website, namely
        </StyledArticleBody>
        <ul>
          <li>
            Google Analytics{' '}
            <Link
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              color={theme.palette.secondaryRange[900]}
            >
              (Privacy Policy)
            </Link>
          </li>
          <li>
            Hotjar{' '}
            <Link
              href="https://www.hotjar.com/legal/policies/privacy/"
              target="_blank"
              rel="noreferrer"
              color={theme.palette.secondaryRange[900]}
            >
              (Privacy Policy)
            </Link>
          </li>
        </ul>
        <StyledArticleBody variant="body1" paragraph>
          By using this website, you must agree to the specified third-party’s Terms of Service and Privacy Policy.
        </StyledArticleBody>
        <StyledArticleBody variant="body1" paragraph>
          Our website is hosted on the Office of the Registrar Chulalongkorn University’s server. They do not endorse us
          in any way including the correctness of the data. You must still follow their Terms of Service and associated
          university’s law.
        </StyledArticleBody>
        <Typography variant="h4" component="h2" gutterBottom>
          2. How we use your information
        </Typography>
        <StyledArticleBody variant="body1" paragraph>
          We use your information for the following purposes:
        </StyledArticleBody>
        <Typography variant="h6" component="h3" gutterBottom>
          2.1 Core Functionality
        </Typography>
        <StyledArticleBody variant="body1" paragraph>
          We use your search and the associated query and context to provide you with the correct ranking of the search
          results. We also use your Google Drive App information storage to provide multi-device course schedule
          synchronization.
        </StyledArticleBody>
        <Typography variant="h6" component="h3" gutterBottom>
          2.2 Functionality Enrichment
        </Typography>
        <StyledArticleBody variant="body1" paragraph>
          In the future, we may use the information to provide you with customized search results and recommendations to
          enhance your experience.
        </StyledArticleBody>
        <Typography variant="h6" component="h3" gutterBottom>
          2.3 Research and Product Development
        </Typography>
        <StyledArticleBody variant="body1">
          We use your information to better understand our user’s interactions with the website. The information is used
          to
        </StyledArticleBody>
        <ul>
          <li>Research user behaviour</li>
          <li>Better understand user needs and preferences</li>
          <li>Improve this website and manage the release of future features</li>
          <li>Create new products and/or features to further satisfy user needs</li>
        </ul>
        <Typography variant="h6" component="h3" gutterBottom>
          2.4 Security
        </Typography>
        <StyledArticleBody variant="body1" paragraph>
          We collect the information to prevent our service against spam and security threats.
        </StyledArticleBody>
        <Typography variant="h4" component="h2" gutterBottom>
          3. How we share your information
        </Typography>
        <StyledArticleBody variant="body1" paragraph>
          Your information is shared within our website’s development team. In the future, We may share your anonymized
          information with our partners who would collaborate with us to better meet our user’s needs. In the case that
          this project is reorganized to other organizations within Chulalongkorn University, your information will be
          transferred along with the website to them.
        </StyledArticleBody>
        <Typography variant="h4" component="h2" gutterBottom>
          4. Contact information and inquiry
        </Typography>
        <StyledArticleBody variant="body1" paragraph>
          If you have any questions or concerns about our use of your information, send us an email to “thinc.org at
          gmail.com”, or more preferably, the{' '}
          <Link href={reportProblemLink} target="_blank" rel="noreferrer" color={theme.palette.secondaryRange[900]}>
            report problem
          </Link>{' '}
          link on the top right corner of this page.
        </StyledArticleBody>
      </Box>
    </Box>
  )
}
