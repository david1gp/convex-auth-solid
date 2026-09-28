import { debounce } from "@solid-primitives/scheduled"
import { useNavigate, useParams } from "@tanstack/solid-router"
import * as a from "valibot"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"
import type { OrgMemberProfile } from "#src/org/member_model/OrgMemberProfile.ts"
import type { OrgModel } from "#src/org/org_model/OrgModel.ts"
import { orgHandleGenerate } from "#src/org/org_model_field/orgHandleSchema.ts"
import { orgDemoOrgAdd } from "#src/org/org_ui/demo/orgDemoOrgAdd.ts"
import { type OrgFormField, orgFormConfig, orgFormField } from "#src/org/org_ui/form/orgFormField.ts"
import type { OrgFormData, OrgFormState, OrgFormStateManagement } from "#src/org/org_ui/form/orgFormStateManagement.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

const fixtureKey = "page-demo:org-core:organizations"
const date = "2026-09-28T09:00:00.000Z"

function orgsGet(): OrgModel[] {
  const store = pageDemoFixtureStoreGet()
  return (
    store.get<OrgModel[]>(fixtureKey) ??
    store.set(fixtureKey, [
      {
        orgHandle: "sample-org",
        name: "Sample Organization",
        description: "A sample team for the page gallery.",
        url: "",
        image: "",
        createdAt: date,
        updatedAt: date,
      },
    ])
  )
}

function fieldsCreate(): OrgFormState {
  return {
    name: createSignalObject(""),
    orgHandle: createSignalObject(""),
    description: createSignalObject(""),
    url: createSignalObject(""),
    image: createSignalObject(""),
  }
}

/** Isolated state for the shared org views. Never creates a live query, mutation or session. */
export function orgDemoStateCreate(
  mode: typeof formMode.add | typeof formMode.edit | typeof formMode.remove = formMode.add,
) {
  const navigate = useNavigate()
  const params = useParams({ strict: false })
  const orgs = createSignalObject(orgsGet())
  const state = fieldsCreate()
  const errors = fieldsCreate()
  const isSubmitting = createSignalObject(false)
  const serverState = createSignalObject<OrgModel>({
    orgHandle: "",
    createdAt: date,
    updatedAt: date,
  })
  const orgHandle = () => params().orgHandle ?? "sample-org"
  const org = () => orgs.get().find((item) => item.orgHandle === orgHandle())
  if (mode !== formMode.add && org()) {
    const current = org()!
    state.name.set(current.name ?? "")
    state.orgHandle.set(current.orgHandle)
    state.description.set(current.description ?? "")
    state.url.set(current.url ?? "")
    state.image.set(current.image ?? "")
    serverState.set(current)
  }

  function validate(field: OrgFormField, value: string) {
    const result = a.safeParse(orgFormConfig[field].schema, value)
    errors[field].set(result.success ? "" : result.issues[0].message)
    return result.success
  }

  const form: OrgFormStateManagement = {
    mode,
    state,
    errors,
    isSubmitting,
    serverState,
    hasErrors: () => Object.values(errors).some((error) => !!error.get()),
    fillTestData: () => {
      state.name.set("Example Organization")
      state.orgHandle.set("example-organization")
    },
    loadData: (org) => {
      state.name.set(org.name ?? "")
      state.orgHandle.set(org.orgHandle)
      state.description.set(org.description ?? "")
      state.url.set(org.url ?? "")
      state.image.set(org.image ?? "")
    },
    validateOnChange: (field) => {
      const validateLater = debounce((value: string) => validate(field, value), 200)
      return Object.assign(
        (value: string) => {
          if (field === orgFormField.name) state.orgHandle.set(orgHandleGenerate(value))
          validateLater(value)
        },
        { clear: validateLater.clear },
      )
    },
    debouncedSave: () => {},
    handleSubmit: async (event) => {
      event.preventDefault()
      if (isSubmitting.get()) return
      if (!org() && mode !== formMode.add) return
      if (mode === formMode.remove) {
        orgs.set(
          pageDemoFixtureStoreGet().set(
            fixtureKey,
            orgs.get().filter((item) => item.orgHandle !== orgHandle()),
          ),
        )
        await navigate({ to: pageDemoHref("/org") })
        return
      }
      const values: OrgFormData = {
        name: state.name.get(),
        orgHandle: state.orgHandle.get(),
        description: state.description.get(),
        url: state.url.get(),
        image: state.image.get(),
      }
      const valid = Object.keys(orgFormField)
        .map((key) => validate(key as OrgFormField, values[key as OrgFormField]))
        .every(Boolean)
      if (!valid) return
      if (mode === formMode.edit) {
        const updated = orgs.get().map((item) =>
          item.orgHandle === orgHandle()
            ? {
                ...item,
                name: values.name,
                description: values.description,
                url: values.url,
                image: values.image,
                updatedAt: date,
              }
            : item,
        )
        orgs.set(pageDemoFixtureStoreGet().set(fixtureKey, updated))
        await navigate({ to: pageDemoHref("/org/:orgHandle", { orgHandle: orgHandle() }) })
        return
      }
      const result = orgDemoOrgAdd(orgs.get(), values)
      if (!result.success) {
        errors.orgHandle.set(result.errorMessage)
        return
      }
      pageDemoFixtureStoreGet().set(fixtureKey, result.data)
      orgs.set(result.data)
      await navigate({ to: pageDemoHref("/org/:orgHandle", { orgHandle: values.orgHandle }) })
    },
  }

  return {
    orgs: orgs.get,
    form,
    orgHandle,
    org,
    members: () => pageDemoFixtureStoreGet().get<OrgMemberProfile[]>(`page-demo:org-members:${orgHandle()}`) ?? [],
    leave: async () => {
      if (!org()) return
      // Demo membership is local: leaving removes this organization's access from the gallery list.
      orgs.set(
        pageDemoFixtureStoreGet().set(
          fixtureKey,
          orgs.get().filter((item) => item.orgHandle !== orgHandle()),
        ),
      )
      await navigate({ to: pageDemoHref("/org") })
    },
  }
}
