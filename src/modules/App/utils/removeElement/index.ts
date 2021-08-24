export default function removeElement(id: string) {
  const element = document.getElementById(id)
  element?.parentElement?.removeChild(element)
}
