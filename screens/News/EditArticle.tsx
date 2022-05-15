import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import ArticleEditor from '~/components/news/ArticleEditor';
import ArticleEditorSkeleton from '~/components/news/ArticleEditor/ArticleEditorSkeleton';
import { View } from '~/components/Themed';
import {
  UpdateArticleMutationVariables,
  useArticleQuery,
  useRemoveArticleMutation,
  useUpdateArticleMutation,
} from '~/generated/graphql';
import { RootStackParamList } from '~/types/navigation';

export type EditArticleParams = { id: string };

const EditArticleScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'EditArticle'>> = ({
  navigation,
  route,
}) => {
  const { id } = route.params;
  const { data, loading } = useArticleQuery({ variables: { id } });
  const [updateArticleMutation] = useUpdateArticleMutation({
    onError: (error) => {
      // handleApolloError(error, showMessage, t);
      console.log('error', error);
    },
  });

  const [removeArticleMutation] = useRemoveArticleMutation({
    variables: {
      id,
    },
    onError: (error) => {
      // handleApolloError(error, showMessage, t);
      console.log('error', error);
    },
  });

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <ArticleEditorSkeleton />
      </View>
    );
  }
  const article = data.article;

  const updateArticle = async (values: UpdateArticleMutationVariables) =>
    new Promise<void>(async (resolve) => {
      const { data, errors } = await updateArticleMutation({ variables: { ...values, id } });
      resolve(); // Allow "listeners" to update local state, ie isLoading, before goBack()
      if (!errors) {
        navigation.goBack();
      }
    });

  const removeArticle = async () =>
    new Promise<void>(async (resolve) => {
      const { data, errors } = await removeArticleMutation();
      resolve(); // Allow "listeners" to update local state, ie isLoading, before goBack()
      if (!errors) {
        navigation.goBack();
      }
    });

  return (
    <View style={{ flex: 1 }}>
      <ArticleEditor
        type="update"
        onSubmit={updateArticle}
        defaults={{ ...article }}
        onRemove={removeArticle}
      />
    </View>
  );
};

export default EditArticleScreen;
