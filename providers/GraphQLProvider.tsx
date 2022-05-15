import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { useKeycloak } from 'expo-keycloak-auth';
import { setContext } from '@apollo/client/link/context';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { NewsPageQuery } from '~/generated/graphql';
// import { GRAPHQL_ADDRESS } from '@env';

const apolloLink = new HttpLink({
  uri: 'https://graphql.api.dsek.se',
  // uri: 'http://172.20.10.7:4000/graphql',
});

const createAuthLink = (token) =>
  setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));

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

const createClient = (token?: string) =>
  new ApolloClient({
    cache: getCache(),
    link: token ? createAuthLink(token).concat(apolloLink) : apolloLink,
  });

type GraphQLProviderProps = PropsWithChildren<{}>;

function GraphQLProvider({ children }: GraphQLProviderProps) {
  const [client, setClient] = useState(createClient());
  const keycloak = useKeycloak();

  useEffect(() => {
    const newClient = createClient(keycloak.token);
    setClient(newClient);
  }, [keycloak.token]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default GraphQLProvider;
