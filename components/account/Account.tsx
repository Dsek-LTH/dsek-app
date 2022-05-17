import { useKeycloak } from 'expo-keycloak-auth';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Text } from '~/components/Themed';

type Props = {};

const AccountPage: React.FC<Props> = (props) => {
  const keycloak = useKeycloak();

  if (!keycloak.ready) {
    return <Text>Laddar</Text>;
  }

  if (!keycloak.isLoggedIn) {
    return (
      <Button onPress={() => keycloak.login()} mode="contained" style={styles.loginButton}>
        Logga in
      </Button>
    );
  }
  return (
    <Button onPress={() => keycloak.logout()} mode="contained" style={styles.loginButton}>
      Logga ut
    </Button>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    // alignSelf: 'center',
  },
});

export default AccountPage;
