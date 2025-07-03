import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { useAuthStore } from '@/stores/auth'
import type { Pinia } from 'pinia'

let _pinia: Pinia | null = null

export function setPiniaInstance(piniaInstance: Pinia): void {
  _pinia = piniaInstance

  // Load token into the store from localStorage/sessionStorage at startup
  const authStore = useAuthStore(_pinia)
  authStore.loadToken()
}

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {
  const authStore = useAuthStore(_pinia)
  const token = authStore.token

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})