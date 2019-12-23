afterAll(() => setTimeout(() => process.exit(0), 5000))

test('should work ', done => {
  expect(1).toBe(1)
  done()
})
