import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import ArticleEditor from '~/components/news/ArticleEditor';
import { View } from '~/components/Themed';
import { CreateArticleMutationVariables, useCreateArticleMutation } from '~/generated/graphql';
import { NewsStackParamList } from '~/types/navigation';

export type CreateArticleParams = undefined;

const CreateArticleScreen: React.FC<
  NativeStackScreenProps<NewsStackParamList, 'CreateArticle'>
> = ({ navigation }) => {
  const [createArticleMutation] = useCreateArticleMutation({
    onCompleted: () => {
      // showMessage(t('publish_successful'), 'success');
      console.log('success creating article');
    },
    onError: (error) => {
      // handleApolloError(error, showMessage, t);
      console.log('error', error);
    },
  });

  const createArticle = async (values: CreateArticleMutationVariables) =>
    new Promise<void>(async (resolve) => {
      const { data, errors } = await createArticleMutation({ variables: values });

      if (!errors) {
        resolve(); // Allow "listeners" to update local state, ie isLoading, before goBack()
        navigation.goBack();
      }
    });

  return (
    <View style={{ flex: 1 }}>
      <ArticleEditor type="create" onSubmit={createArticle} />
    </View>
  );
};

export default CreateArticleScreen;
