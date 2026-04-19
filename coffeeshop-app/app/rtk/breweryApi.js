import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const breweryApi = createApi({
    reducerPath: "breweryApi",
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.openbrewerydb.org/v1/breweries' }),
    tagTypes: ["Brewery"],
    endpoints: (builder) => ({

        searchBreweries: builder.query({
            query: ({ name = '', city = '', country = '', type = '', page = 1, perPage = 10 }) => {
                const params = new URLSearchParams()
                if (name)    params.append('by_name', name)
                if (city)    params.append('by_city', city)
                if (country) params.append('by_country', country)
                if (type)    params.append('by_type', type)
                params.append('page', page)
                params.append('per_page', perPage)
                return `?${params.toString()}`
            },
        }),

        getBreweryCount: builder.query({
            query: ({ name = '', city = '', country = '', type = '' } = {}) => {
                const params = new URLSearchParams()
                if (name)    params.append('by_name', name)
                if (city)    params.append('by_city', city)
                if (country) params.append('by_country', country)
                if (type)    params.append('by_type', type)
                return `/meta?${params.toString()}`
            },
        }),

        getBreweryById: builder.query({
            query: (id) => `/${id}`
        }),
    })
})

export const {useSearchBreweriesQuery, useGetBreweryCountQuery, useGetBreweryByIdQuery} = breweryApi