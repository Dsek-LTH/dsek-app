import React from 'react';
import AccountPage from '~/components/account/Account';
import { View } from '~/components/Themed';
import { StyleSheet } from 'react-native';

export type AccountScreenParams = undefined;

type Props = {};

const AccountScreen: React.FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <AccountPage />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AccountScreen;
