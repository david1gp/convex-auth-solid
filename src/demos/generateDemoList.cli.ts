import { generateDemoList } from "~ui/generate_demo_list/generateDemoList"

// const got = await findDemoFilesRecursive("./src/")
// console.log(got)

// const searchPath = join(process.cwd(), "src/demos")
// const outputPath = join(process.cwd(), "src/generate_demo_list/demoList.ts")
const searchDir = "src/demos"
const outputFile = "src/demos/demoList.ts"

generateDemoList(searchDir, outputFile)
