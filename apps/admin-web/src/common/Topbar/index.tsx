import SectionLink from './components/SectionLink'
import { links, LinkSectionType } from './linkConstant'
import { StyledNav } from './styled'

// TODO: change route names
// TODO: download font
export default function SideBar() {
  return (
    <>
      <StyledNav>
        {Object.keys(links).map((key: keyof LinkSectionType) => (
          <SectionLink key={key} sectionTitle={String(key)} links={links[key]} />
        ))}
      </StyledNav>
    </>
  )
}
