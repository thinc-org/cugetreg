import GetRegLogo from '/public/GetRegLogo.png'
import Image from 'next/image'

import SectionLink from './components/SectionLink'
import { LinkSectionType, links } from './linkConstant'
import { StyledLogoContainer, StyledNav } from './styled'

// TODO: change route names
export default function SideBar() {
  return (
    <>
      <StyledNav>
        <StyledLogoContainer>
          <Image priority src={GetRegLogo} alt="CuGetReg Logo" width={97} height={61} />
        </StyledLogoContainer>
        {Object.keys(links).map((key: keyof LinkSectionType) => (
          <SectionLink key={key} sectionTitle={String(key)} links={links[key]} />
        ))}
      </StyledNav>
    </>
  )
}
