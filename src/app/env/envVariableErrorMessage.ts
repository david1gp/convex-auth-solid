export function envVariableErrorMessage(name: string) {
  return "process.env." + name + " not set or defined"
}
