import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { addRouteWithCors } from "@/auth/convex/headers/cors/addRouteWithCors"
import { signInViaEmail1RequestHandler } from "@/auth/convex/sign_in_email/signInViaEmail1RequestHandler"
import { signInViaEmailEnterOtp1RequestHandler } from "@/auth/convex/sign_in_email/signInViaEmailEnterOtp1RequestHandler"
import { signInViaPw1RequestHandler } from "@/auth/convex/sign_in_pw/signInViaPw1RequestHandler"
import { loginProvider, socialLoginProvider } from "@/auth/model_field/socialLoginProvider"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import type { HttpRouter } from "convex/server"
import { httpMethod } from "./headers/httpMethod"
import { signInUsingSocialAuth1RequestHandler } from "./sign_in_social/signInUsingSocialAuth1RequestHandler"
import { signUp1RequestHandler } from "./sign_up/signUp1RequestHandler"
import { signUpConfirmEmail1RequestHandler } from "./sign_up/signUpConfirmEmail1RequestHandler"
import { userEmailChange1RequestHandler } from "./user/email_change/userEmailChange1RequestHandler"
import { userEmailChange2ConfirmHandler } from "./user/email_change/userEmailChange2ConfirmHandler"
import { userPasswordChange1RequestHandler } from "./user/pw_change/userPasswordChange1RequestHandler"
import { userPasswordChange2ConfirmHandler } from "./user/pw_change/userPasswordChange2ConfirmHandler"
import { userProfileUpdate1RequestHandler } from "./user/profile_update/userProfileUpdate1RequestHandler"

export function addHttpRoutesAuth(http: HttpRouter) {
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signInViaGithub, httpMethod.GET, async (ctx, request) => {
    return signInUsingSocialAuth1RequestHandler(socialLoginProvider.github, ctx, request)
  })
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signInViaGoogle, httpMethod.GET, async (ctx, request) => {
    return signInUsingSocialAuth1RequestHandler(socialLoginProvider.google, ctx, request)
  })
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signInViaDev, httpMethod.GET, async (ctx, request) => {
    return signInUsingSocialAuth1RequestHandler(loginProvider.dev, ctx, request)
  })
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signInViaMicrosoft, httpMethod.GET, async (ctx, request) => {
    return signInUsingSocialAuth1RequestHandler(socialLoginProvider.microsoft, ctx, request)
  })

  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signUp, httpMethod.POST, signUp1RequestHandler)
  addRouteWithCors(
    http,
    apiAuthBasePath + apiPathAuth.signUpConfirmEmail,
    httpMethod.POST,
    signUpConfirmEmail1RequestHandler,
  )

  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signInViaPw, httpMethod.POST, signInViaPw1RequestHandler)
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signInViaEmail, httpMethod.POST, signInViaEmail1RequestHandler)

  addRouteWithCors(
    http,
    apiAuthBasePath + apiPathAuth.signInViaEmailEnterOtp,
    httpMethod.POST,
    signInViaEmailEnterOtp1RequestHandler,
  )

  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.profileUpdate, httpMethod.POST, userProfileUpdate1RequestHandler)
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.passwordChange, httpMethod.POST, userPasswordChange1RequestHandler)
  addRouteWithCors(
    http,
    apiAuthBasePath + apiPathAuth.passwordChangeConfirm,
    httpMethod.POST,
    userPasswordChange2ConfirmHandler,
  )
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.emailChange, httpMethod.POST, userEmailChange1RequestHandler)
  addRouteWithCors(
    http,
    apiAuthBasePath + apiPathAuth.emailChangeConfirm,
    httpMethod.POST,
    userEmailChange2ConfirmHandler,
  )

  addRouteWithCors(http, "/api/isOnline", httpMethod.GET, async (ctx, request) => {
    return new Response("OK")
  })
  return http
}
