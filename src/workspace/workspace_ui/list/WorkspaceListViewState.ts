export interface WorkspaceListViewState {
  workspaces: () => { workspaceHandle: string; name: string }[] | null | undefined
  page: () => number
  canPrevious: () => boolean
  canNext: () => boolean
  previous: () => void
  next: () => void
  loading: () => boolean
}
