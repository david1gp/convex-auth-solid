import { Match, Switch } from "solid-js"
import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"
import { UserProfileView } from "#src/auth/ui/profile/UserProfileView.tsx"
import { UserProfileMeChangeEmailView } from "#src/auth/ui/profile_me/UserProfileMeChangeEmailView.tsx"
import { UserProfileMeChangePasswordView } from "#src/auth/ui/profile_me/UserProfileMeChangePasswordView.tsx"
import { UserProfileMeDeleteView } from "#src/auth/ui/profile_me/UserProfileMeDeleteView.tsx"
import { UserProfileMeEditView } from "#src/auth/ui/profile_me/UserProfileMeEditPage.tsx"
import { UserProfileMeImageView } from "#src/auth/ui/profile_me/UserProfileMeImageView.tsx"
import { UserProfileMeView } from "#src/auth/ui/profile_me/UserProfileMePage.tsx"
import { SignUpConfirmEmailView } from "#src/auth/ui/sign_up/email/SignUpConfirmEmailPage.tsx"
import { SignUpPageContent } from "#src/auth/ui/sign_up/SignUpPage.tsx"
import { AllgroupsSsoPage } from "#src/sso/ui/AllgroupsSsoPage.tsx"
import { allgroupsSsoDemoStateCreate } from "#src/sso/ui/allgroupsSsoDemoStateCreate.ts"
import { LinkButtonInternal } from "#ui/interactive/link/LinkButton.tsx"
import { authRemainingPageDemoRendererStateCreate } from "./authRemainingPageDemoRendererStateCreate.ts"

/** Prepared views: the page boundary must explicitly opt in each route before public activation. */
export function AuthRemainingPageDemoRenderer(p: { route: string }) {
  const state = authRemainingPageDemoRendererStateCreate()
  return (
    <Switch>
      <Match when={p.route === "/sign-up"}>
        <SignUpPageContent
          demo
          signInHref={pageDemoHref("/sign-in")}
          confirmHref={pageDemoHref("/sign-up-confirm-email")}
          message={state.signUpMessage()}
        />
      </Match>
      <Match when={p.route === "/sign-up-confirm-email"}>
        <SignUpConfirmEmailView initialEmail={state.email()} actionFn={state.confirm} />
        <p role="status">{state.message()}</p>
        <LinkButtonInternal to={pageDemoHref("/sign-up")}>Sign-up demo</LinkButtonInternal> ·{" "}
        <LinkButtonInternal to={pageDemoHref("/profile")}>Profile demo</LinkButtonInternal>
      </Match>
      <Match when={p.route === "/sso"}>
        <AllgroupsSsoPage stateFactory={allgroupsSsoDemoStateCreate} />
        <LinkButtonInternal to={pageDemoHref("/sign-in")}>Sign-in demo</LinkButtonInternal>
      </Match>
      <Match when={p.route === "/profile"}>
        <UserProfileMeView
          profile={state.profile.profile()}
          hrefs={{
            image: pageDemoHref("/profile/update-image"),
            edit: pageDemoHref("/profile/edit"),
            email: pageDemoHref("/profile/change-email"),
            password: pageDemoHref("/profile/change-password"),
            apiKeys: pageDemoHref("/profile/api-keys"),
          }}
        />
        <p role="status">{state.profile.message()}</p>
        <LinkButtonInternal to={pageDemoHref("/u/:username")}>Public profile demo</LinkButtonInternal> ·{" "}
        <LinkButtonInternal to={pageDemoHref("/profile/delete")}>Delete account demo</LinkButtonInternal>
      </Match>
      <Match when={p.route === "/profile/edit"}>
        <UserProfileMeEditView
          profile={state.profile.profile()}
          onSave={state.profile.save}
          cancelHref={pageDemoHref("/profile")}
        />
        <p role="status">{state.profile.message()}</p>
        <LinkButtonInternal to={pageDemoHref("/profile")}>View demo profile</LinkButtonInternal>
      </Match>
      <Match when={p.route === "/profile/change-password"}>
        <UserProfileMeChangePasswordView stateFactory={state.profileFinal.passwordStateCreate} />
        <p role="status">{state.profileFinal.message()}</p>
        <LinkButtonInternal to={pageDemoHref("/profile")}>Profile demo</LinkButtonInternal> ·{" "}
        <LinkButtonInternal to={pageDemoHref("/profile/change-email")}>Change email demo</LinkButtonInternal>
      </Match>
      <Match when={p.route === "/profile/change-email"}>
        <UserProfileMeChangeEmailView stateFactory={state.profileFinal.emailStateCreate} />
        <p role="status">{state.profileFinal.message()}</p>
        <LinkButtonInternal to={pageDemoHref("/profile")}>Profile demo</LinkButtonInternal> ·{" "}
        <LinkButtonInternal to={pageDemoHref("/profile/change-password")}>Change password demo</LinkButtonInternal>
      </Match>
      <Match when={p.route === "/profile/update-image"}>
        <UserProfileMeImageView
          stateFactory={state.profileFinal.imageStateCreate}
          profileHref={pageDemoHref("/profile")}
        />
        <p role="status">{state.profileFinal.message()}</p>
        <LinkButtonInternal to={pageDemoHref("/u/:username")}>Public profile demo</LinkButtonInternal>
      </Match>
      <Match when={p.route === "/profile/delete"}>
        <UserProfileMeDeleteView
          stateFactory={state.profileFinal.deleteStateCreate}
          profileHref={pageDemoHref("/profile")}
        />
        <p role="status">{state.profileFinal.message()}</p>
        <LinkButtonInternal to={pageDemoHref("/sign-up")}>Sign-up demo</LinkButtonInternal> ·{" "}
        <LinkButtonInternal to={pageDemoHref("/profile")}>Profile demo</LinkButtonInternal>
      </Match>
      <Match when={p.route === "/u/:username"}>
        <UserProfileView profile={state.profileFinal.publicProfile()} />
        <LinkButtonInternal to={pageDemoHref("/profile")}>My profile demo</LinkButtonInternal> ·{" "}
        <LinkButtonInternal to={pageDemoHref("/profile/edit")}>Edit profile demo</LinkButtonInternal>
      </Match>
    </Switch>
  )
}
