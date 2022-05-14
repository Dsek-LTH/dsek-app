import React from 'react';
import { useUploadTokenMutation } from '~/generated/graphql';
import useNotifications from '~/hooks/useNotifications';

const NotificationProvider: React.FC = ({ children }) => {
  const token = useNotifications();
  const [uploadTokenMutation, { error }] = useUploadTokenMutation();

  React.useEffect(() => {
    if (token) {
      uploadTokenMutation({ variables: { token } });
    }
  }, [token, uploadTokenMutation]);
  return <React.Fragment>{children}</React.Fragment>;
};

export default NotificationProvider;
