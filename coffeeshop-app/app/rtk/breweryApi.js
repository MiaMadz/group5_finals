import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const breweryApi = createApi({
    reducerPath: "breweryApi",
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.openbrewerydb.org/v1/breweries' }),
    tagTypes: ["Brewery"],
    endpoints: (builder) => ({

        // Combined search with all filters + pagination
        searchBreweries: builder.query({
            query: ({ name = '', city = '', state = '', type = '', page = 1, perPage = 10 }) => {
                const params = new URLSearchParams()
                if (name)  params.append('by_name', name)
                if (city)  params.append('by_city', city)
                if (state) params.append('by_state', state)
                if (type)  params.append('by_type', type)
                params.append('page', page)
                params.append('per_page', perPage)
                return `?${params.toString()}`
            },
        }),

        // Get total count for pagination
        getBreweryCount: builder.query({
            query: ({ name = '', city = '', state = '', type = '' }) => {
                const params = new URLSearchParams()
                if (name)  params.append('by_name', name)
                if (city)  params.append('by_city', city)
                if (state) params.append('by_state', state)
                if (type)  params.append('by_type', type)
                return `/meta?${params.toString()}`
            },
        }),

        getBreweryById: builder.query({
            query: (id) => `/${id}`
        }),
    })
})

export const {useSearchBreweriesQuery, useGetBreweryCountQuery, useGetBreweryByIdQuery} = breweryApi