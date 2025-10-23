import { v5 as uuidv5, v4 as uuidv4, NIL } from 'uuid'
import type { UseFetchOptions } from '#app'

type TApiFetchOptions<T> = UseFetchOptions<T> & {
  staleTime?: number
  cacheTtlMs?: number
}

// Simple in-memory cache shared per runtime process
const __memoryCache = new Map<string, { expiresAt: number, data: unknown }>()

export function useApiFetch<T> (
  url: (() => string) | string | MaybeRef<string>,
  options: TApiFetchOptions<T> = {}
) {
  const config = useRuntimeConfig()
 
  // const accessToken = useCookie('access_token')
  // const refreshToken = useCookie('refresh_token')

  // let didRetry = false
  const controller = new AbortController()

  const {
    headers: _headers,
    onRequest,
    onRequestError,
    onResponse,
    onResponseError,
    ...restOptions
  } = options
  const { default: _default, ...filteredRestOptions } = restOptions as any
  const keyPrefix = uuidv4()
  const key = () => {
    const method = unref(options.method) || ''
    const whereShouldBePrefixed = [
      'POST',
      'PUT',
      'PATCH',
      'put',
      'patch',
      'post'
    ]
    const _keyPrefix = whereShouldBePrefixed.includes(method) ? keyPrefix : ''

    return generateKeyWithUUIDv5(_keyPrefix, typeof url === 'function' ? url() : unref(url), unref(options?.params || options?.query), unref(options.headers), unref(options?.body), method)
  }
  // Optional client-side TTL cache
  const methodForCache = (unref(options.method) || 'GET').toString().toUpperCase()
  const cacheTtl = options.cacheTtlMs
  const cacheKey = generateKeyWithUUIDv5('', typeof url === 'function' ? url() : unref(url), unref(options?.params || options?.query), unref(options.headers), unref(options?.body), methodForCache)
  const now = Date.now()
  const cached = cacheTtl && methodForCache === 'GET' ? __memoryCache.get(cacheKey) : undefined
  const isFresh = !!cached && cached.expiresAt > now

  const defaultToPass = isFresh ? () => cached!.data as T : undefined

  const response = useFetch<T>(url, {
    key,
    baseURL: config.public.siteUrl,
    headers: unref(_headers) as any,
    signal: controller.signal,
    ...(defaultToPass && { default: defaultToPass }),
    ...(isFresh && { immediate: false }),
    // async onResponseError ({ response, options }) {
    //   if (response.status === 401 && !didRetry && refreshToken.value) {
    //     didRetry = true
    //     const refreshed = await refreshAccessToken(refreshToken.value)

    //     if (refreshed) {
    //       accessToken.value = refreshed
    //       const { method, ...restOptions } = options
    //       return useFetch<T>(url, {
    //         ...restOptions,
    //         ...(method ? { method: method as any } : {}),
    //         headers: {
    //           ..._headers,
    //           Authorization: `Bearer ${refreshed}`
    //         },
    //         signal: controller.signal
    //       })
    //     }
    //     else {
    //       return navigateTo('/login')
    //     }
    //   }
    // },
    ...(onRequest && { onRequest }),
    ...(onRequestError && { onRequestError }),
    ...(onResponse && { onResponse }),
    ...(onResponseError && { onResponseError }),
    ...filteredRestOptions
  })

  const data = ref(response.data.value as T | null)

  watch(response.data, (newData) => {
    if (newData) {
      data.value = newData
      // Save to in-memory cache if enabled
      if (cacheTtl && methodForCache === 'GET') {
        __memoryCache.set(cacheKey, {
          expiresAt: Date.now() + cacheTtl,
          data: newData as unknown
        })
      }
    }
  })

  return Object.assign(response, {
    data,
    clearData: () => { data.value = null; response.clear() },
    abort: () => { /* no-op временно, чтобы не залипало */ }
  })
}

export async function refreshAccessToken (refreshToken: string) {
  try {
    const config = useRuntimeConfig()
    const response = await $fetch<{ access: string }>('account/auth/token/refresh/', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      body: { refresh: refreshToken }
    })
    return response.access
  }
  catch {
    return null
  }
}

type TPrimitive = string | number | boolean | null | undefined | bigint

type TNormalizedValue
  = | TPrimitive
    | { __type: 'BigInt', value: string }
    | { __type: 'Function', name: string, source: string }
    | { __type: 'File', name: string, size: number, type: string, lastModified: number }
    | { __type: 'FormData', entries: [string, TNormalizedValue][] }
    | TNormalizedValue[]
    | { [key: string]: TNormalizedValue }

function normalize (value: unknown): TNormalizedValue {
  if (typeof value === 'bigint') {
    return { __type: 'BigInt', value: value.toString() }
  }
  if (typeof value === 'function') {
    // eslint-disable-next-line ts/no-unsafe-function-type
    const fn = value as Function
    return {
      __type: 'Function',
      name: fn.name || '<anonymous>',
      source: fn.toString().trim()
    }
  }
  if (value instanceof File) {
    return {
      __type: 'File',
      name: value.name,
      size: value.size,
      type: value.type,
      lastModified: value.lastModified
    }
  }
  if (value instanceof FormData) {
    const entries: [string, TNormalizedValue][] = []
    for (const [key, v] of value.entries()) {
      entries.push([key, normalize(v)])
    }
    entries.sort(([a], [b]) => a.localeCompare(b))
    return { __type: 'FormData', entries }
  }
  if (Array.isArray(value)) {
    return value.map(normalize)
  }
  if (value !== null && typeof value === 'object') {
    const obj: Record<string, TNormalizedValue> = {}
    for (const key of Object.keys(value).sort()) {
      obj[key] = normalize((value as any)[key])
    }
    return obj
  }
  return value as TPrimitive
}

function generateKeyWithUUIDv5 (...inputs: any[]) {
  const norm = inputs.map(normalize)
  return uuidv5(JSON.stringify(norm), NIL)
}
