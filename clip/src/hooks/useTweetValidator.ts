import { Dispatch, useCallback, useState } from "react";
import { TweetContent } from "../lib/types/tweetContents";

type useTweetValidator = {
  urlError: string;
  setUrlError: Dispatch<string | undefined>;
  dropUrlErrorIfNeeded: () => void;
  bodyError: string;
  setBodyError: Dispatch<string | undefined>;
  dropBodyErrorIfNeeded: () => void;
  validTweet: (content: TweetContent) => boolean;
};

export const useTweetValidator = (): useTweetValidator => {
  const [urlError, setUrlError] = useState<string | undefined>();
  /**
   * URLが条件を満たしたら、urlErrorにundefinedをセットする
   * @type {() => void}
   */
  const dropUrlErrorIfNeeded: () => void = useCallback(() => {
    if (urlError && urlError.length > 0) {
      setUrlError(undefined);
    }
  }, [urlError]);

  const [bodyError, setBodyError] = useState<string | undefined>();
  /**
   * Bodyが条件を満たしたら、bodyErrorにundefinedをセットする
   * @type {() => void}
   */
  const dropBodyErrorIfNeeded: () => void = useCallback(() => {
    if (bodyError && bodyError.length > 0) {
      setBodyError(undefined);
    }
  }, [bodyError]);

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

  return { urlError, setUrlError, dropUrlErrorIfNeeded, bodyError, setBodyError, dropBodyErrorIfNeeded, validTweet };
};
