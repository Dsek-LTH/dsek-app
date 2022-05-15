import { ArticleScreenParams } from "~/screens/News/Article"
import { CreateArticleParams } from "~/screens/News/CreateArticle"
import { EditArticleParams } from "~/screens/News/EditArticle"
import { NewsScreenParams } from "~/screens/News/News"

export type RootStackParamList = {
  News: NewsScreenParams,
  Article: ArticleScreenParams
  CreateArticle: CreateArticleParams
  EditArticle: EditArticleParams
}

