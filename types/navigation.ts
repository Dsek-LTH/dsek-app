import { AccountScreenParams } from "~/screens/Account"
import { ArticleScreenParams } from "~/screens/News/Article"
import { CreateArticleParams } from "~/screens/News/CreateArticle"
import { EditArticleParams } from "~/screens/News/EditArticle"
import { NewsScreenParams } from "~/screens/News/News"

export type NewsStackParamList = {
  News: NewsScreenParams,
  Article: ArticleScreenParams
  CreateArticle: CreateArticleParams
  EditArticle: EditArticleParams
}

export type AccountStackParamList = {
  Account: AccountScreenParams,
}

export type RootTabParamList = {
  'news-tab': undefined
  'account-tab': undefined
}