import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Meta } from "@storybook/react/types-6-0";
import StarWar, { FilmsData, GET_FILMS } from "./StarwarApollo";
import { MockedProvider, MockedResponse } from "@apollo/client/testing"

export default {
    title: "Network/ApolloTest",
    component: StarWar,
} as Meta

const client = new ApolloClient({
    uri: "https://swapi-graphql.netlify.app/.netlify/functions/index",
    cache: new InMemoryCache()
})

export function StarWarStory() {
    return <ApolloProvider client={client}>
            <StarWar/>
        </ApolloProvider>
}

const mocks: MockedResponse<FilmsData>[] = [
    {
        request: {
            query: GET_FILMS
        },

        result: {
            data: {
                allFilms: {
                    films: [
                        {
                            title: "My Title"
                        }
                    ]
                }
            }
        }
    }
]

export function StarWarStoryMocked() {
    return <MockedProvider mocks={mocks}>
            <StarWar/>
        </MockedProvider>
}