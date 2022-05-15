import { ArticleScreenParams } from "~/screens/News/Article"
import { CreateArticleProps } from "~/screens/News/CreateArticle"
import { NewsScreenParams } from "~/screens/News/News"

export type RootStackParamList = {
  News: NewsScreenParams,
  Article: ArticleScreenParams
  CreateArticle: CreateArticleProps
}

