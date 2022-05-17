import { useKeycloak } from 'expo-keycloak-auth';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Text, View } from '~/components/Themed';
import { useUser } from '~/providers/UserProvider';
import AccountInfo from './AccountInfo';

type Props = {};

const AccountPage: React.FC<Props> = (props) => {
  const keycloak = useKeycloak();
  const { user } = useUser();

  if (!keycloak.ready) {
    return <Text>Laddar</Text>;
  }

  if (!keycloak.isLoggedIn || !user) {
    return (
      <Button onPress={() => keycloak.login()} mode="contained" style={styles.loginButton}>
        Logga in
      </Button>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        alignSelf: 'stretch',
      }}>
      <AccountInfo id={user.id} />
      <Button onPress={() => keycloak.logout()} mode="contained" style={styles.loginButton}>
        Logga ut
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    // alignSelf: 'center',
  },
});

export default AccountPage;
