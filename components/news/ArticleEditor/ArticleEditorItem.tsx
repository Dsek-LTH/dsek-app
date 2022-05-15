import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
// @ts-ignore package does not have typescript types
import { TextInput } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import MarkdownEditor from '~/components/markdown/MarkdownEditor';
import { ScrollView, View } from '~/components/Themed';
import { useGetPresignedPutUrlMutation } from '~/generated/graphql';

type EditorProps = {
  header: string;
  body: string;
  selectedTab: 'write' | 'preview';
  onTabChange: (tab: 'write' | 'preview') => void;
  onHeaderChange: (value: string) => void;
  onImageChange: (value: File) => void;
  imageName: string;
  onBodyChange: (value: string) => void;
  publishAsOptions: { value: string; label: string }[];
  mandateId: string;
  setMandateId: (value) => void;
};

export default function ArticleEditorItem({
  header,
  body,
  selectedTab,
  onTabChange,
  onHeaderChange,
  onBodyChange,
  onImageChange,
  imageName,
  publishAsOptions,
  mandateId,
  setMandateId,
}: EditorProps) {
  const [fileName, setFileName] = useState('');
  const [showDropDown, setShowDropDown] = useState(false);

  const [getPresignedPutUrlMutation] = useGetPresignedPutUrlMutation({
    variables: {
      fileName,
    },
  });

  // const saveImage = async function* (inputData: ArrayBuffer) {
  //   const fileType = await FileType.fromBuffer(inputData);
  //   const file = new File([inputData], 'name', { type: fileType.mime });
  //   setFileName(`public/${uuidv4()}.${fileType.ext}`);

  //   const data = await getPresignedPutUrlMutation();
  //   putFile(data.data.article.presignedPutUrl, file, file.type, showMessage, t);

  //   yield data.data.article.presignedPutUrl.split('?')[0];
  //   return true;
  // };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flexGrow: 1 }} keyboardVerticalOffset={120}>
      <ScrollView style={{ flexGrow: 1, marginHorizontal: 8, marginVertical: 16 }}>
        <TextInput
          mode="outlined"
          label="Rubrik"
          onChangeText={onHeaderChange}
          multiline
          value={header}
          style={{ marginBottom: 16 }}
        />
        <DropDown
          label={'Publicera som'}
          mode={'outlined'}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          value={mandateId}
          setValue={setMandateId}
          list={publishAsOptions}
        />
        <MarkdownEditor value={body} onChange={onBodyChange} style={{ marginVertical: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
