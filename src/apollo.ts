import {ApolloClient, from, split,  HttpLink, InMemoryCache} from "@apollo/client";
import {onError} from "@apollo/client/link/error";
import { getMainDefinition } from '@apollo/client/utilities';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {createClient} from 'graphql-ws';

const httpLink = new HttpLink({
    uri: "https://frontend-test-api.aircall.io/graphql",
    headers: {
        authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : "",
    },
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: 'wss://frontend-test-api.aircall.io/websocket',
    }),
);

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors)
        graphQLErrors?.forEach(({ message }) => {
                if(message === "Unauthorized"){
                    fetch("https://frontend-test-api.aircall.io/graphql", {
                        method: "POST",
                        body: JSON.stringify( {query: `mutation {refreshTokenV2 { access_token refresh_token }}`} ),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                            Accept: 'application/json',
                            authorization: `Bearer ${localStorage.getItem('refresh_token')}`
                        }
                    }).then(response => {
                        return response.json()
                    }).then(json => {
                        localStorage.setItem("token", json.data.refreshTokenV2.access_token || "");
                        localStorage.setItem("refresh_token", json.data.refreshTokenV2.refresh_token || "");
                    })
                }
            },
        );

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

export const apollo = new ApolloClient({
    cache: new InMemoryCache({}),
    link: from([splitLink, errorLink]),
});
