import { StyledLogoutButton } from './styled'

interface LogoutButtonProps {
  handleClick?: () => Promise<void> | void
}

export default function LogoutButton({ handleClick }: LogoutButtonProps) {
  return (
    <>
      <StyledLogoutButton onClick={handleClick}>Log out</StyledLogoutButton>
    </>
  )
}
