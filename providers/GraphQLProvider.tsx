import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';
import React, { PropsWithChildren, useState } from 'react';
import { NewsPageQuery } from '~/generated/graphql';
// import { GRAPHQL_ADDRESS } from '@env';

const apolloLink = new HttpLink({
  uri: 'https://graphql.api.dsek.se',
});

// const createAuthLink = (token) =>
//   setContext((_, { headers }) => ({
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   }));

const getCache = () => {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // news: offsetLimitPagination(),
          news: {},
        },
      },
    },
  });
};

const createClient = () =>
  new ApolloClient({
    cache: getCache(),
    link: apolloLink,
  });

type GraphQLProviderProps = PropsWithChildren<{}>;

function GraphQLProvider({ children }: GraphQLProviderProps) {
  const [client] = useState(createClient());

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default GraphQLProvider;
