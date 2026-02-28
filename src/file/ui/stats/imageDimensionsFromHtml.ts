export type ImageDimensions = {
  imageWidth: number
  imageHeight: number
}

export async function imageDimensionsFromHtmlElement(img: HTMLImageElement): Promise<ImageDimensions> {
  return await new Promise<ImageDimensions>((resolve) => {
    img.onload = () => {
      const imageWidth = img.naturalWidth
      const imageHeight = img.naturalHeight
      // console.log("addImageDimensions", { imageWidth, imageHeight })
      resolve({ imageWidth, imageHeight })
    }
  })
}
