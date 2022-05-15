import React from 'react';
import { Button } from 'react-native-paper';
import { Tabs, TabScreen } from 'react-native-paper-tabs';
import { View } from '~/components/Themed';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import theme from '~/theme';
import ArticleEditorItem from './ArticleEditorItem';

type TranslationObject = {
  sv: string;
  en: string;
};

type EditorProps = {
  header: TranslationObject;
  onHeaderChange: (translation: TranslationObject) => void;
  body: TranslationObject;
  onBodyChange: (translation: TranslationObject) => void;
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

const ArticleEditorDummy: React.FC<EditorProps> = ({
  header,
  onHeaderChange,
  body,
  onBodyChange,
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
}) => {
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
    <View
      style={{
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 100,
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>
      <Button
        disabled={!header.sv}
        mode="contained"
        style={{ width: removeArticle ? '40%' : '60%', alignSelf: 'center' }}
        contentStyle={{ paddingVertical: 8 }}
        onPress={onSubmit}>
        {loading ? 'Loading...' : saveButtonText}
      </Button>
      {removeArticle && (
        <Button
          disabled={!header.sv}
          mode="contained"
          color={theme['dark'].colors.error}
          style={{ width: '40%', alignSelf: 'center' }}
          contentStyle={{ paddingVertical: 8 }}
          onPress={removeArticle}>
          {removeLoading ? 'Loading...' : 'Delete'}
        </Button>
      )}
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
};

export default ArticleEditorDummy;
