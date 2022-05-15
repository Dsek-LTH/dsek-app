import { useKeycloak } from 'expo-keycloak-auth';
import React, { useEffect, useState } from 'react';
import ArticleEditorSkeleton from '~/components/news/ArticleEditor/ArticleEditorSkeleton';
import { Text, View } from '~/components/Themed';
import {
  CreateArticleMutationVariables,
  UpdateArticleMutationVariables,
} from '~/generated/graphql';
import { getFullName } from '~/helpers/memberFunctions';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import ArticleEditorDummy from './ArticleEditorDummy';

const TYPE_TO_ACCESS = {
  create: 'news:article:create',
  update: 'news:article:update',
};

type Props =
  | {
      type: 'create';
      onSubmit: (values: CreateArticleMutationVariables) => Promise<void> | void;
      defaults?: Partial<CreateArticleMutationVariables>;
    }
  | {
      type: 'update';
      onSubmit: (values: Omit<UpdateArticleMutationVariables, 'id'>) => Promise<void> | void;
      defaults: Partial<UpdateArticleMutationVariables>;
      onRemove: () => Promise<void>;
    };

const ArticleEditor: React.FC<Props> = (props) => {
  const { type, onSubmit, defaults } = props; // Necessary for onRemove to work with TypeScript

  const keycloak = useKeycloak();
  const [mandateId, setMandateId] = useState(defaults?.mandateId ?? 'none');
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

  const [body, setBody] = useState({ sv: defaults?.body ?? '', en: defaults?.bodyEn ?? '' });
  const [header, setHeader] = useState({
    sv: defaults?.header ?? '',
    en: defaults?.headerEn ?? '',
  });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageName, setImageName] = useState(defaults?.imageName ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const _onSubmit = async () => {
    setIsLoading(true);
    // let fileType;
    // if (imageFile) {
    //   fileType = await FileType.fromBlob(imageFile);
    //   setImageName(`public/${uuidv4()}.${fileType.ext}`);
    // }

    // if (imageFile) {
    //   putFile(data.article.create.uploadUrl, imageFile, fileType.mime, showMessage, t);
    // }
    await onSubmit({
      header: header.sv,
      headerEn: header.en,
      body: body.sv,
      bodyEn: body.en,
      imageName: imageFile ? imageName : undefined,
      mandateId: mandateId !== 'none' ? mandateId : undefined,
    });
    setIsLoading(false);
  };

  const _onRemove =
    type === 'update'
      ? async () => {
          setIsRemoving(true);
          await props.onRemove();
          setIsRemoving(false);
        }
      : undefined;

  if (!keycloak.ready || userLoading) {
    return <ArticleEditorSkeleton />;
  }

  if (!keycloak?.isLoggedIn || !user) {
    return <Text>You are not logged in.</Text>;
  }

  if (!hasAccess(apiContext, TYPE_TO_ACCESS[type])) {
    return <Text>You do not have permissions to create articles.</Text>;
  }

  return (
    <ArticleEditorDummy
      header={header}
      onHeaderChange={setHeader}
      body={body}
      onBodyChange={setBody}
      loading={isLoading}
      onSubmit={_onSubmit}
      saveButtonText={type === 'create' ? 'Publish' : 'Save'}
      onImageChange={(file: File) => {
        setImageFile(file);
        setImageName(file.name);
      }}
      imageName={imageName}
      publishAsOptions={publishAsOptions}
      mandateId={mandateId}
      setMandateId={setMandateId}
      removeArticle={_onRemove}
      removeLoading={isRemoving}
    />
  );
};

export default ArticleEditor;
