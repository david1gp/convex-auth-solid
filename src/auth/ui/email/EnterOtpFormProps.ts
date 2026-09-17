import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

export interface EnterOtpFormProps extends MayHaveClass {
  title: string
  subtitle: string
  sentMessage: string
  instruction: string
  buttonText: string
  actionFn: (otp: string, email: string, returnPath: string) => Promise<void>
}
