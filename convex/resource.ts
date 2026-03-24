import { resourceCreateInternalMutation, resourceCreateMutation } from "#src/resource/convex/resourceCreateMutation.js"
import { resourceDeleteInternalMutation, resourceDeleteMutation } from "#src/resource/convex/resourceDeleteMutation.js"
import { resourceEditInternalMutation, resourceEditMutation } from "#src/resource/convex/resourceEditMutation.js"
import { resourceFileAddInternalMutation, resourceFileAddMutation } from "#src/resource/convex/resourceFileAddMutation.js"
import { resourceFileListInternalQuery, resourceFileListQuery } from "#src/resource/convex/resourceFileListQuery.js"
import {
    resourceFileRemoveInternalMutation,
    resourceFileRemoveMutation,
} from "#src/resource/convex/resourceFileRemoveMutation.js"
import { resourceFilesGetInternalQuery, resourceFilesGetQuery } from "#src/resource/convex/resourceFilesGetQuery.js"
import { resourceGetInternalQuery, resourceGetQuery } from "#src/resource/convex/resourceGetQuery.js"
import { resourcesListInternalQuery, resourcesListQuery } from "#src/resource/convex/resourceListQuery.js"

export {
    resourceCreateInternalMutation,
    resourceCreateMutation,
    resourceDeleteInternalMutation,
    resourceDeleteMutation,
    resourceEditInternalMutation,
    resourceEditMutation,
    // Resource
    resourceFileAddInternalMutation,
    resourceFileAddMutation,
    resourceFileListInternalQuery,
    resourceFileListQuery,
    resourceFileRemoveInternalMutation,
    resourceFileRemoveMutation,
    // Resource Files Get
    resourceFilesGetInternalQuery,
    resourceFilesGetQuery,
    // Get
    resourceGetInternalQuery,
    resourceGetQuery,
    // List
    resourcesListInternalQuery,
    resourcesListQuery
}
