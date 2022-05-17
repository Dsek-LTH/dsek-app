import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Surface } from 'react-native-paper';
import ListItem from 'react-native-paper/lib/typescript/components/List/ListItem';
import { useMemberPageQuery } from '~/generated/graphql';
import { getClassYear, getFullName } from '~/helpers/memberFunctions';
import useColorScheme from '~/hooks/useColorScheme';
import theme from '~/theme';
import { Text, ViewProps } from '../../Themed';
import AccountInfoSkeleton from './Skeleton';

type Props = { id: string; style?: ViewProps };

const AccountInfo: React.FC<Props> = ({ id, style }) => {
  const { loading, data } = useMemberPageQuery({
    variables: { id },
  });
  const colorScheme = useColorScheme();

  if (loading) {
    return <AccountInfoSkeleton />;
  }
  if (!data) {
    return <Text>Användare hittas inte</Text>;
  }
  const member = data.memberById;
  return (
    <Surface style={[styles.container, style]}>
      <List.Item title={getFullName(member)} description={member.student_id} />
      <List.Item
        title={
          <View style={styles.year}>
            <MaterialIcons
              name="school"
              style={styles.yearIcon}
              size={20}
              color={theme[colorScheme].colors.text}
            />
            <Text>{getClassYear(member)}</Text>
          </View>
        }
      />
      {member.mandates.map((mandate) => (
        <List.Item
          key={mandate.id}
          style={styles.mandate}
          title={mandate.position.name}
          description={`${mandate.start_date.toString()} till ${mandate.end_date.toString()}`}
        />
      ))}
    </Surface>
  );
};

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 5,
  },
  year: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearIcon: {
    marginRight: 8,
  },
  mandate: {},
});

export default AccountInfo;
