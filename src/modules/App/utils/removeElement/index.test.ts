describe('removeElement', () => {
  const mockRemoveChild = jest.fn()
  const spy = jest.spyOn(document, 'getElementById')

  it.each`
    element
    ${null}
    ${undefined}
    ${{}}
    ${{ parentElement: { removeChild: mockRemoveChild } }}
  `('should be able to removeElement sucessfully when element=$element', async ({ element }) => {
    spy.mockReturnValueOnce(element)
    const { removeElement } = await import('.')
    const id = 'id'
    removeElement(id)
    expect(spy).toBeCalledWith(id)
    if (element?.parentElement?.removeChild) {
      expect(mockRemoveChild).toBeCalledWith(element)
    }
  })
})

export {}
