/**
 * The signed-in user, as returned by the auth service's login/refresh.
 *
 * Lives in its own module because it has nothing to do with quotes — it was
 * historically parked at the bottom of types/quote.ts and imported from
 * there by the auth composable and the auth modal.
 */
export interface AuthUser {
  id: string
  email: string
  username: string
  display_name: string
}
