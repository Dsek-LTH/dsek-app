import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import ArticleEditor from '~/components/news/ArticleEditor';
import { RootStackParamList } from '~/types/navigation';
import { useKeycloak } from 'expo-keycloak-auth';
import { getFullName } from '~/helpers/memberFunctions';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useCreateArticleMutation } from '~/generated/graphql';
import { useUser } from '~/providers/UserProvider';
import ArticleEditorSkeleton from '~/components/news/ArticleEditor/ArticleEditorSkeleton';
import { Text } from '~/components/Themed';

export type CreateArticleProps = undefined;

const CreateArticleScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'CreateArticle'>
> = ({ navigation }) => {
  const keycloak = useKeycloak();
  const [mandateId, setMandateId] = useState('none');
  const [publishAsOptions, setPublishAsOptions] = useState<{ value: string; label: string }[]>([
    { value: 'none', label: '' },
  ]);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (user) {
      const me = { value: 'none', label: getFullName(user) };
      setPublishAsOptions([
        me,
        ...user.mandates.map((mandate) => ({
          value: mandate.id,
          label: `${getFullName(user)}, ${mandate.position.name}`,
        })),
      ]);
    }
  }, [user]);
  const apiContext = useApiAccess();

  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [body, setBody] = useState({ sv: '', en: '' });
  const [header, setHeader] = useState({ sv: '', en: '' });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageName, setImageName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [createArticleMutation, { loading }] = useCreateArticleMutation({
    variables: {
      header: header.sv,
      headerEn: header.en,
      body: body.sv,
      bodyEn: body.en,
      imageName: imageFile ? imageName : undefined,
      mandateId: mandateId !== 'none' ? mandateId : undefined,
    },
    onCompleted: () => {
      // showMessage(t('publish_successful'), 'success');
      console.log('success creating article');
    },
    onError: (error) => {
      // handleApolloError(error, showMessage, t);
      console.log('error', error);
    },
  });

  const createArticle = async () => {
    setIsLoading(true);
    // let fileType;
    // if (imageFile) {
    //   fileType = await FileType.fromBlob(imageFile);
    //   setImageName(`public/${uuidv4()}.${fileType.ext}`);
    // }
    const { data, errors } = await createArticleMutation();

    // if (imageFile) {
    //   putFile(data.article.create.uploadUrl, imageFile, fileType.mime, showMessage, t);
    // }
    if (!errors) {
      setIsLoading(false);
      navigation.goBack();
    }
  };

  if (!keycloak.ready || userLoading) {
    return <ArticleEditorSkeleton />;
  }

  if (!keycloak?.isLoggedIn || !user) {
    return <Text>You are not logged in.</Text>;
  }

  if (!hasAccess(apiContext, 'news:article:create')) {
    return <Text>You do not have permissions to create articles.</Text>;
  }

  return (
    <ArticleEditor
      header={header}
      onHeaderChange={setHeader}
      body={body}
      onBodyChange={setBody}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      loading={false}
      onSubmit={createArticle}
      saveButtonText={'Publish'}
      onImageChange={(file: File) => {
        setImageFile(file);
        setImageName(file.name);
      }}
      imageName={imageName}
      publishAsOptions={publishAsOptions}
      mandateId={mandateId}
      setMandateId={setMandateId}
    />
  );
};

export default CreateArticleScreen;
