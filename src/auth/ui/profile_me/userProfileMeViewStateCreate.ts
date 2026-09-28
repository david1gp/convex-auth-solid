import {
  urlUserProfileMeApiKeys,
  urlUserProfileMeChangeEmail,
  urlUserProfileMeChangePassword,
  urlUserProfileMeEdit,
  urlUserProfileMeImage,
} from "#src/auth/url/pageRouteAuth.ts"

export function userProfileMeViewStateCreate(
  props: () => { hrefs?: { image: string; edit: string; email: string; password: string; apiKeys: string } },
) {
  return {
    hrefs: () =>
      props().hrefs ?? {
        image: urlUserProfileMeImage(),
        edit: urlUserProfileMeEdit(),
        email: urlUserProfileMeChangeEmail(),
        password: urlUserProfileMeChangePassword(),
        apiKeys: urlUserProfileMeApiKeys(),
      },
  }
}
