import { authorize, getOAuthTokens } from "../oauth/twitter";
import { TwitterApi } from "twitter-api-v2";
import { FormValues, TweetContent } from "../lib/types/tweetContents";

type useTwitterReturns = {
  createTweetContent: (values: FormValues) => TweetContent;
  sendTweet: (text: string) => Promise<void>;
};

export const useTweet = (): useTwitterReturns => {
  /**
   * フォームの値からツイートのメッセージを生成する
   * @param {FormValues} values
   * @returns {TweetContent}
   */
  const createTweetContent = (values: FormValues): TweetContent => {
    const text = values.body + "\n\n" + values.url + "\n\n" + values.tag.join(" ");
    return { text: text };
  };

  /**
   * 認証済みのTwitterAPIを返す
   * @returns {Promise<TwitterApi>}
   */
  const _getAPI = async (): Promise<TwitterApi> => {
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
    const api: TwitterApi = await _getAPI();
    await api.v2.tweet(text);
  };

  return { sendTweet, createTweetContent };
};
