import React from 'react';
import { ViewStyle } from 'react-native';
import { StyleProp, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Tabs, TabScreen } from 'react-native-paper-tabs';
import { Markdown, Text, View } from '../Themed';

type Props = { value: string; onChange: (value: string) => void; style?: ViewStyle };

const MarkdownEditor: React.FC<Props> = ({ value, onChange, style }) => {
  return (
    <View style={{ ...styles.container, ...(style ?? {}) }}>
      {/* <Tabs style={{ ...styles.container, ...(style ?? {}) }}> */}
      <Tabs disableSwipe>
        <TabScreen label="Redigera">
          <TextInput multiline value={value} onChangeText={onChange} label="Beskrivning" />
        </TabScreen>
        <TabScreen label="Förhandsvisa">
          <Markdown>{value}</Markdown>
        </TabScreen>
      </Tabs>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: 200,
    marginHorizontal: 8,
  },
});

export default MarkdownEditor;
