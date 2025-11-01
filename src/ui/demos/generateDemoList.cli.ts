import { generateDemoList } from "~ui/generate_demo_list/generateDemoList"

// const got = await findDemoFilesRecursive("./src/")
// console.log(got)

// const searchPath = join(process.cwd(), "src/demos")
// const outputPath = join(process.cwd(), "src/generate_demo_list/demoList")
const searchDir = "src"
const outputFile = "src/ui/demos/demoList.ts"

generateDemoList(searchDir, outputFile)
