import { Banner } from './components/Banner'
import { TopButton } from './components/TopButton'
import { FooterContainer } from './styled'

export function Footer() {
  return (
    <FooterContainer>
      <TopButton />
      <Banner />
    </FooterContainer>
  )
}
