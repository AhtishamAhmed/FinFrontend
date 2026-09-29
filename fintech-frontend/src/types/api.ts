// Mirrors Application.Wrappers.ApiResponse<T> from the backend.
// Every controller action in FintechAPI returns a response wrapped in this shape,
// so every API call on the frontend resolves to ApiResponse<TData>.
export interface ApiResponse<TData> {
  succecced: boolean
  message: string | null
  errors: string[] | null
  data: TData
}
