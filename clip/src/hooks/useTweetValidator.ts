import { TweetContent } from "../lib/types/tweetContents";

type useTweetValidator = {
  validTweet: (content: TweetContent) => boolean;
};

export const useTweetValidator = (): useTweetValidator => {
  const _validTweetText = (text: string): boolean => {
    const length: number = text.length;
    return !(length < 1 || length > 280);
  };

  /**
   * ツイートの長さのバリデーター
   * @param {TweetContent} content
   * @returns {boolean}
   */
  const validTweet = (content: TweetContent): boolean => _validTweetText(content.text);

  return { validTweet };
};
