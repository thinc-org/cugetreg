import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material'
import Cookies from 'js-cookie'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react'
import Link from 'next/link'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface ConsentSubmitResult {
  coreCheckbox: boolean
  additaionV1Checkbox: boolean
}

interface WireConsent {
  //V1
  version: number
  consentCore: boolean
  consentAdditionalV1: boolean
}

const COOKIE_KEY = 'CONSENT-COOKIE'

class ConsentStore {
  consent: WireConsent
  dialogOpen: boolean = false

  constructor() {
    const cookie = Cookies.get(COOKIE_KEY)
    if (cookie) {
      this.consent = JSON.parse(cookie)
    } else {
      this.consent = { version: 1, consentCore: false, consentAdditionalV1: false }
    }

    if (!this.consent.consentCore) {
      this.dialogOpen = true
    }

    makeAutoObservable(this)
  }

  update(result: ConsentSubmitResult) {
    this.consent = {
      version: 1,
      consentCore: result.coreCheckbox,
      consentAdditionalV1: result.additaionV1Checkbox,
    }

    Cookies.set(COOKIE_KEY, JSON.stringify(this.consent), { expires: 365 })
  }
}

export const consentStore = new ConsentStore()

const PDPAForm = observer(({ consentStore }: { consentStore: ConsentStore }) => {
  const { register, handleSubmit, formState } = useForm()

  const onSubmit = (data: ConsentSubmitResult) => {
    consentStore.update(data)
    consentStore.dialogOpen = false
  }
  return (
    <Dialog open={consentStore.dialogOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Privacy Notice</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Per PDPA law. We are requiring you to agree and consent the following items before using our Application.
            You can always contact our Data Protection Officer regarding the use of your data using the form on the top
            right corner (แจ้งปัญหา)
          </DialogContentText>
          <h3>Consent Form</h3>
          <Stack>
            <Stack sx={{ border: 'solid' }} direction="row">
              <Checkbox
                {...register('coreCheckbox', { required: true })}
                defaultChecked={consentStore.consent.consentCore}
              />
              <p>
                <p>
                  I Agree to allow CUGetReg team and its affiliates to collect, store. publish and process following
                  data
                </p>
                <ul>
                  <li>My IP Address</li>
                  <li>My Login Session Data and the associated cookies</li>
                  <li>My Chula User Account Info which includes: My Chula Account Email, My Name, and My Student ID</li>
                  <li>My record of consent and its associated cookie</li>
                </ul>
                in order for CUGetReg team to deliver <em>core functionality</em> including but not limited to
                <ul>
                  <li>Course Search</li>
                  <li>Cross-device Course Synchronization</li>
                  <li>Selected course cart</li>
                  <li>Performs Legal Obligation including but not limited to Computer Crime Law</li>
                  <li>Performs Threat Prevention</li>
                </ul>
                <p>
                  I also agree that I have read and do understand the purposes of storing, collecting, using, and
                  publishing of my personal data from CUGetReg Team.
                </p>
                <p>
                  I agree/disagree to consent in this document with my own volition and not under duress and I agree
                  that I can revoke my consent at any time except when not applicable due to my other contract with
                  CUGetReg Team or due to restriction of the law.
                </p>
                <p>
                  In case that I were to revoke my consent. I agree that it will prevent me from using ALL the
                  functionalities of the CUGetReg Website and that revoking my consent will not affect the processing of
                  my personal data before that.
                </p>
              </p>
            </Stack>
            <Stack sx={{ border: 'solid' }} direction="row">
              <Checkbox
                {...register('additaionV1Checkbox')}
                defaultChecked={consentStore.consent.consentAdditionalV1}
              />
              <p>
                I agree to allow CUGetReg team and its affiliates to collect, store, process and publish following data
                <ul>
                  <li>My Device Identifier and its associated cookie</li>
                  <li>My Session Identifier</li>
                  <li>
                    My Interaction with the website which includes but not limited to Click Event, Input Event and Page
                    Visit Event
                  </li>
                  <li>My User Agent</li>
                  <li>My User Name which allows those interaction to be correlated and identify me</li>
                </ul>
                in order for CUGetReg team to deliver <em>additional functionalities</em> including but not limited to
                <ul>
                  <li>Provides additional functionalities such as Course Recommendation</li>
                  <li>Research and development</li>
                  <li>Perform experiment on the users (including myself)</li>
                  <li>Improve the system</li>
                </ul>
              </p>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit">I Agree</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
})

export const HackPDPAForm = observer(() => {
  return <PDPAForm consentStore={consentStore} />
})
