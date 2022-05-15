import React from 'react';
import ArticleEditorItem from './ArticleEditorItem';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { ScrollView, Text, View } from '~/components/Themed';
import { Tabs, TabScreen, useTabIndex, useTabNavigation } from 'react-native-paper-tabs';
import { KeyboardAvoidingView } from 'react-native';

type TranslationObject = {
  sv: string;
  en: string;
};

type EditorProps = {
  header: TranslationObject;
  onHeaderChange: (translation: TranslationObject) => void;
  body: TranslationObject;
  onBodyChange: (translation: TranslationObject) => void;
  selectedTab: 'write' | 'preview';
  onTabChange: (tab: 'write' | 'preview') => void;
  onImageChange: (file: File) => void;
  imageName: string;
  loading: boolean;
  removeLoading?: boolean;
  removeArticle?: () => void;
  onSubmit: () => void;
  saveButtonText: string;
  publishAsOptions: { value: string; label: string }[];
  mandateId: string;
  setMandateId: (value) => void;
};

export default function ArticleEditor({
  header,
  onHeaderChange,
  body,
  onBodyChange,
  selectedTab,
  onTabChange,
  onImageChange,
  imageName,
  loading,
  removeLoading,
  onSubmit,
  removeArticle,
  saveButtonText,
  publishAsOptions,
  mandateId,
  setMandateId,
}: EditorProps) {
  const apiContext = useApiAccess();

  const handleHeaderChange = (value: string, tag: string) => {
    onHeaderChange({
      ...header,
      [tag]: value,
    });
  };

  const handleImageChange = (value: File) => {
    onImageChange(value);
  };

  const handleBodyChange = (translation: string, languageTag: string) => {
    onBodyChange({
      ...body,
      [languageTag]: translation,
    });
  };

  const Bottom = () => (
    <View style={{ flexGrow: 0, flexShrink: 0, flexBasis: 100 }}>
      <Text>Bottom</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Tabs
      // dark={false} // works the same as AppBar in react-native-paper
      // onChangeIndex={(newIndex) => {}} // react on index change
      >
        <TabScreen label="Svenska">
          <ArticleEditorItem
            header={header.sv}
            body={body.sv}
            selectedTab={selectedTab}
            onTabChange={onTabChange}
            onHeaderChange={(event) => handleHeaderChange(event, 'sv')}
            onBodyChange={(translation) => handleBodyChange(translation, 'sv')}
            onImageChange={handleImageChange}
            imageName={imageName}
            publishAsOptions={publishAsOptions}
            mandateId={mandateId}
            setMandateId={setMandateId}
          />
        </TabScreen>
        <TabScreen label="Engelska">
          <ArticleEditorItem
            header={header.en}
            body={body.en}
            selectedTab={selectedTab}
            onTabChange={onTabChange}
            onHeaderChange={(event) => handleHeaderChange(event, 'en')}
            onBodyChange={(translation) => handleBodyChange(translation, 'en')}
            onImageChange={handleImageChange}
            imageName={imageName}
            publishAsOptions={publishAsOptions}
            mandateId={mandateId}
            setMandateId={setMandateId}
          />
        </TabScreen>
      </Tabs>
      <Bottom />
    </View>
  );
}
