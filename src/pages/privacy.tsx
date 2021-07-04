import { Box, Card, Container, Paper, Typography } from '@material-ui/core'
import React from 'react'

export default function PrivacyPolicy() {
  return (
    <Box marginTop="32px" marginBottom="32px">
      <Paper>
        <Box padding="32px">
          <Typography variant="h1">Privacy Policy</Typography>
          <Typography variant="h2">1.Information we collect</Typography>
          <Typography variant="h3">1.1 Information you provide to us</Typography>
          <p>When you log in with Google. We collect your</p>
          <ul>
            <li>Name</li>
            <li>Google User ID</li>
            <li>Google Drive App Data (Only the data associated with this app such as your course schedule) </li>
          </ul>
          <Typography variant="h3">1.2 Information we collect automatically</Typography>
          <p>When you use our website. We collect your interactions with the website, which include</p>
          <ul>
            <li>
              Device ID (associated with the browser that you use and can be renewed by clearing the browser&apos;s
              Local Storage)
            </li>
            <li>Search Query</li>
            <li>Click Interaction</li>
            <li>Page Visit</li>
            <li>Google User ID</li>
            <li>Course you selected</li>
            <li>IP address</li>
            <li>User Agent</li>
          </ul>
          <p>
            When you submit the feedback form. The above information will be included in the submission if you leave the
            Session ID field filled.
          </p>
          <Typography variant="h3">1.3 Third-Party Information</Typography>

          <p>We use third-party services to collect your interactions with the website, namely</p>
          <ul>
            <li>
              Google Analytic <a href="https://policies.google.com/privacy">(Privacy Policy)</a>
            </li>
            <li>
              Hotjar <a href="https://www.hotjar.com/legal/policies/privacy/">(Privacy Policy)</a>
            </li>
          </ul>
          <p>
            By using this website, You must agree to the specified third-party’s Term of Service and Privacy Policy.
          </p>
          <p>
            Our website is hosted on the Office of the Registrar Chulalongkorn University’s server. They don’t endorse
            us in any way including the correctness of the data. You must still follow their Terms of Service and
            associated university’s law.
          </p>
          <Typography variant="h2">2. How we use your data</Typography>
          <p>We use your data for following purposes</p>
          <Typography variant="h3">2.1 Core Functionality</Typography>
          <p>
            We use your search and the associated query and context to provide you with the correct ranking of the
            search result. We also use your Google Drive App Data storage to provides multi-device course schedule
            synchronization.
          </p>
          <Typography variant="h3">2.2 Functionality Enrichment</Typography>
          <p>
            In the future, We may use the information to provide you with customized search results and recommendations
            to enhance your experience.
          </p>
          <Typography variant="h3">2.3 Research and Product Development</Typography>
          <p>
            We use your information to better understand our user’s interactions with the website. The information are
            used for
          </p>
          <ul>
            <li>Research the user’s behaviour</li>
            <li>Better understand our user’s needs and preferences</li>
            <li>Improve this website and better manage the development team’s effort.</li>
            <li>Create new products to further satisfy our user’s need</li>
          </ul>
          <Typography variant="h3">2.4 Security</Typography>
          <p>We collect the information to prevent our service against spam and security threats.</p>
          <Typography variant="h2">3. How we share your data</Typography>
          <p>
            Your data is shared within our website’s development team. In the future, We may share your anonymized data
            with our partner who would collaborate with us to better meet our user’s needs. In the case that this
            project is reorganized to other organizations within Chulalongkorn University, your data will be transferred
            along with the website to them.
          </p>
          <Typography variant="h2">4. Contact Information and Inquiry</Typography>
          <p>
            If you have any questions or concerns about our use of your data. Send us an email to “thinc.org at
            gmail.com”, or more preferably, the report problem link on the top right corner of this page.
          </p>
          <Typography variant="h1">About Us</Typography>
          <p>
            Thinc. is a student club organized under Engineering Student Council (ESC) of Chulalongkorn University. We
            develop several products serving the Chulalongkorn University community such as CU Pop Bus and CUTUBall74
            electronic ticket system.
          </p>
        </Box>
      </Paper>
    </Box>
  )
}
