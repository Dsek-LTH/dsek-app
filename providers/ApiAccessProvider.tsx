import React, { useContext, useEffect, useMemo } from 'react';
import { useApiAccessQuery } from '~/generated/graphql';
import { useKeycloak } from 'expo-keycloak-auth';

export type apiContextReturn = {
  apis: Set<string>;
  apisLoading: boolean;
  hasAccess: (name: string) => boolean;
};

const defaultContext: apiContextReturn = {
  apis: new Set(),
  apisLoading: true,
  hasAccess: () => false,
};

const ApiAccessContext = React.createContext(defaultContext);

export const ApiAccessProvider: React.FC = ({ children }) => {
  const { loading: apisLoading, data, refetch } = useApiAccessQuery();

  const memoized = useMemo(
    () => ({
      apis: new Set(data?.apiAccess?.map((api) => api.name)),
      hasAccess: (name: string) =>
        !apisLoading && new Set(data?.apiAccess?.map((api) => api.name)).has(name),
      apisLoading,
    }),
    [apisLoading, data?.apiAccess]
  );

  return <ApiAccessContext.Provider value={memoized}>{children}</ApiAccessContext.Provider>;
};

export const useApiAccess = () => {
  const context = useContext(ApiAccessContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const hasAccess = (context: apiContextReturn, name: string): boolean => {
  return !context.apisLoading && context.apis.has(name);
};

export default ApiAccessContext;
