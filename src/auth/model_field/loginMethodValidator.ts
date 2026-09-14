import { loginMethodSchema } from "#src/auth/model_field/loginMethod.ts"
import { loginProviderSchema, socialLoginProviderSchema } from "#src/auth/model_field/socialLoginProvider.ts"
import { valibotFieldToConvexValidator } from "#src/utils/convex/valibotToConvex.ts"

export const loginMethodValidator = valibotFieldToConvexValidator(loginMethodSchema)

export const socialLoginProviderValidator = valibotFieldToConvexValidator(socialLoginProviderSchema)

export const loginProviderValidator = valibotFieldToConvexValidator(loginProviderSchema)
