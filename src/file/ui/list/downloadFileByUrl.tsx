export async function downloadFileByUrl(url: string, fileName: string): Promise<void> {
  const op = "downloadFileByUrl"
  try {
    // Fetch the file from the URL
    const response = await fetch(url)

    if (!response.ok) {
      console.error(op, response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Get the file as blob
    const blob = await response.blob()

    // Create download link
    const a = document.createElement("a")
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)

    // Trigger download
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)

    // Clean up
    setTimeout(() => {
      window.URL.revokeObjectURL(a.href)
      a.remove()
    }, 100)
  } catch (error) {
    console.error("Download failed:", error)
    // Fallback: open in new tab if fetch fails due to CORS
    window.open(url, "_blank")
  }
}
