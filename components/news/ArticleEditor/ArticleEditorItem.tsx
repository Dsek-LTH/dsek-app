import React from 'react';
// @ts-ignore package does not have typescript types
import { TextInput } from 'react-native-paper';
import { View } from '~/components/Themed';
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
  publishAsOptions: { id: string; label: string }[];
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
  const [fileName, setFileName] = React.useState('');

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
    <View style={{ marginHorizontal: 8, marginVertical: 16 }}>
      <TextInput
        mode="outlined"
        label="Rubrik"
        onChangeText={onHeaderChange}
        multiline
        value={header}
      />
      {/* <FormControl>
        <InputLabel id="demo-simple-select-label">{t('news:publish_as')}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue="none"
          value={mandateId}
          label={t('news:publish_as')}
          onChange={(event) => setMandateId(event.target.value)}>
          {publishAsOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      {/* imageName && (
        <Typography variant="subtitle1">
          <Typography fontWeight={500}>Current image:</Typography>
          {imageName}
        </Typography>
      )} */
      /*  <label htmlFor="contained-button-file">
        <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
          {t('news:selectImage')}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={onImageChange}
            id="contained-button-file"
          />
        </Button>
      </label> */}

      {/* <ReactMde
        value={body}
        onChange={onBodyChange}
        selectedTab={selectedTab}
        onTabChange={onTabChange}
        l18n={{
          write: t('news:write'),
          preview: t('news:preview'),
          uploadingImage: t('news:uploadingImage'),
          pasteDropSelect: t('news:pasteDropSelect'),
        }}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
        }
        paste={{
          saveImage,
        }}
      /> */}
    </View>
  );
}
