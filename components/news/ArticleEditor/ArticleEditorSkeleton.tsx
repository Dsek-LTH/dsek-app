import React from 'react';
import { Text, View } from '~/components/Themed';

export default function ArticleEditorSkeleton() {
  return <Text>Loading</Text>;
  /* <Stack spacing={2}>
      <Typography variant="h1">
        <Skeleton />
      </Typography>
      <Typography variant="h3">
        <Skeleton />
      </Typography>
      <Typography variant="h3">
        <Skeleton />
      </Typography>
      <Skeleton variant="rectangular" height={200} />
    </Stack> */
}
