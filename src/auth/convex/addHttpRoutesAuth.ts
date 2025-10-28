import { apiAuthBasePath } from "@/auth/api/apiAuthBasePath"
import { addRouteWithCors } from "@/auth/convex/headers/cors/addRouteWithCors"
import { signInViaEmail1RequestHandler } from "@/auth/convex/sign_in_email/signInViaEmail1RequestHandler"
import { signInViaEmailEnterOtp1RequestHandler } from "@/auth/convex/sign_in_email/signInViaEmailEnterOtp1RequestHandler"
import { signInViaPw1RequestHandler } from "@/auth/convex/sign_in_pw/signInViaPw1RequestHandler"
import { loginProvider, socialLoginProvider } from "@/auth/model/socialLoginProvider"
import { apiPathAuth } from "@/auth/url/apiPathAuth"
import type { HttpRouter } from "convex/server"
import { httpMethod } from "./headers/httpMethod"
import { signInUsingSocialAuth1RequestHandler } from "./sign_in_social/signInUsingSocialAuth1RequestHandler"
import { signUp1RequestHandler } from "./sign_up/signUp1RequestHandler"
import { signUpConfirmEmail1RequestHandler } from "./sign_up/signUpConfirmEmail1RequestHandler"

export function addHttpRoutesAuth(http: HttpRouter) {
  // Oauth / GitHub
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signInViaGithub, httpMethod.GET, async (ctx, request) => {
    return signInUsingSocialAuth1RequestHandler(socialLoginProvider.github, ctx, request)
  })
  // Oauth / Google
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signInViaGoogle, httpMethod.GET, async (ctx, request) => {
    return signInUsingSocialAuth1RequestHandler(socialLoginProvider.google, ctx, request)
  })
  // Oauth / Dev
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signInViaDev, httpMethod.GET, async (ctx, request) => {
    return signInUsingSocialAuth1RequestHandler(loginProvider.dev, ctx, request)
  })

  // Sign up routes
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signUp, httpMethod.POST, signUp1RequestHandler)
  // Sign up confirm email routes
  addRouteWithCors(
    http,
    apiAuthBasePath + apiPathAuth.signUpConfirmEmail,
    httpMethod.POST,
    signUpConfirmEmail1RequestHandler,
  )

  // Sign in via password routes
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signInViaPw, httpMethod.POST, signInViaPw1RequestHandler)
  // Sign in via email routes
  addRouteWithCors(http, apiAuthBasePath + apiPathAuth.signInViaEmail, httpMethod.POST, signInViaEmail1RequestHandler)

  // Sign in via email enter OTP routes
  addRouteWithCors(
    http,
    apiAuthBasePath + apiPathAuth.signInViaEmailEnterOtp,
    httpMethod.POST,
    signInViaEmailEnterOtp1RequestHandler,
  )

  // Is online routes
  addRouteWithCors(http, "/api/isOnline", httpMethod.GET, async (ctx, request) => {
    return new Response("OK")
  })
  return http
}
