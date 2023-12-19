import { authorize, getOAuthTokens } from "../oauth/twitter";
import { TwitterApi } from "twitter-api-v2";
import { FormValues, TweetContent } from "../lib/types/tweetContents";

type useTwitterReturns = {
  sendTweet: (text: string) => Promise<void>;
  validTweet: (content: TweetContent) => boolean;
  createTweetContent: (values: FormValues) => TweetContent;
};

export const useTwitter = (): useTwitterReturns => {
  /**
   * 認証済みのTwitterAPIを返す
   * @returns {Promise<TwitterApi>}
   */
  const getAPI = async (): Promise<TwitterApi> => {
    await authorize();
    const tokens = await getOAuthTokens();
    const at = tokens?.accessToken;
    return new TwitterApi(at || "");
  };

  /**
   * ツイートする
   * @param {string} text
   * @returns {Promise<void>}
   */
  const sendTweet = async (text: string): Promise<void> => {
    const api: TwitterApi = await getAPI();
    await api.v2.tweet(text);
  };

  /**
   * ツイートのバリデーター
   * @param {TweetContent} content
   * @returns {boolean}
   */
  const validTweet = (content: TweetContent): boolean => validTweetText(content.text);

  /**
   * フォームの値からツイートのメッセージを生成する
   * @param {FormValues} values
   * @returns {TweetContent}
   */
  const createTweetContent = (values: FormValues): TweetContent => {
    const text = values.body + "\n\n" + values.url + "\n\n" + values.tag.join(" ");
    return { text: text };
  };

  return { sendTweet, validTweet, createTweetContent };
};

const validTweetText = (text: string): boolean => {
  const length: number = text.length;
  return !(length < 1 || length > 280);
};
