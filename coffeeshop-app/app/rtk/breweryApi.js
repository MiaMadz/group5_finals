import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const buildCafeQuery = (params = {}) => {
    const queryParams = { ...params };
    if (queryParams.perPage) {
        queryParams.limit = queryParams.perPage;
        delete queryParams.perPage;
    }
    const searchParams = new URLSearchParams(queryParams).toString();
    return searchParams ? `/?${searchParams}` : `/`;
};

export const breweryApi = createApi({
    reducerPath: "breweryApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/cafes` }),
    tagTypes: ["Brewery"],
    endpoints: (builder) => ({

        getCafes: builder.query({
            query: (params = {}) => buildCafeQuery(params),
            providesTags: ['Brewery'],
        }),

        searchBreweries: builder.query({
            query: (params = {}) => buildCafeQuery(params),
            providesTags: ['Brewery'],
        }),

        getCountryCount: builder.query({
            query: () => '/countries/count',
            providesTags: ['Brewery'],
        }),

        getCountries: builder.query({
            query: () => '/countries',
            providesTags: ['Brewery'],
        }),

        getBreweryCount: builder.query({
            query: (params = {}) => {
                const queryParams = { ...params };
                if (queryParams.perPage) {
                    delete queryParams.perPage;
                }
                const searchParams = new URLSearchParams(queryParams).toString();
                return searchParams ? `/count?${searchParams}` : `/count`;
            },
            providesTags: ['Brewery'],
        }),

        getCafeById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Brewery', id }],
        }),

        addCafe: builder.mutation({
            query: (data) => ({ url: '/', method: 'POST', body: data }),
            invalidatesTags: ['Brewery'],
        }),

        updateCafe: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/${id}`, method: 'PUT', body: data }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Brewery', id }],
        }),

        deleteCafe: builder.mutation({
            query: (id) => ({ url: `/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [{ type: 'Brewery', id }],
        }),

        importFromApi: builder.mutation({
            query: (payload) => ({ url: '/import', method: 'POST', body: payload }),
            invalidatesTags: ['Brewery'],
        }),
    })
})

export const {
    useGetCafesQuery,
    useSearchBreweriesQuery,
    useGetBreweryCountQuery,
    useGetCountryCountQuery,
    useGetCountriesQuery,
    useGetCafeByIdQuery,
    useAddCafeMutation,
    useUpdateCafeMutation,
    useDeleteCafeMutation,
    useImportFromApiMutation,
} = breweryApi