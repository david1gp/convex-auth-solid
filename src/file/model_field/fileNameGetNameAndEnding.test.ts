import { describe, expect, it } from "bun:test"
import { fileNameGetNameAndEnding } from "./fileNameGetNameAndEnding"

describe("getNameAndEnding", () => {
  it("should have ending with length of 10 -> that should get reduced to 5", () => {
    const [name, ending] = fileNameGetNameAndEnding("document.1234567890")

    expect(name).toBe("document")
    expect(ending).toBe(".12345") // ending should be trimmed to max 5 characters
  })

  it("should handle files without ending", () => {
    const [name, ending] = fileNameGetNameAndEnding("document")

    expect(name).toBe("document")
    expect(ending).toBe("")
  })

  it("should handle files with short ending", () => {
    const [name, ending] = fileNameGetNameAndEnding("image.png")

    expect(name).toBe("image")
    expect(ending).toBe(".png")
  })

  it("should handle files with multiple dots", () => {
    const [name, ending] = fileNameGetNameAndEnding("my.complex.file.name.txt")

    expect(name).toBe("my-complex-file-name")
    expect(ending).toBe(".txt")
  })

  it("should clean ending with special characters", () => {
    const [name, ending] = fileNameGetNameAndEnding("document.txt@#$")

    expect(name).toBe("document")
    expect(ending).toBe(".txt")
  })

  it("should handle empty ending after cleaning", () => {
    const [name, ending] = fileNameGetNameAndEnding("document.@#$")

    expect(name).toBe("document")
    expect(ending).toBe("")
  })

  it("rename jpeg ending to jpg", () => {
    const [name, ending] = fileNameGetNameAndEnding("image.jpeg")

    expect(name).toBe("image")
    expect(ending).toBe(".jpg")
  })
})
