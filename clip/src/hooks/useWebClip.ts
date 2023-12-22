import fetch from "node-fetch";
import { URL } from "node:url";
import * as cheerio from "cheerio";
import { showToast, Toast } from "@raycast/api";
import ja from "../locale/ja.json";

type useParseWebClipReturns = {
  validateUrl: (urlString: string) => Promise<boolean>;
  getTitle: (url: string) => Promise<string>;
};

export const useWebClip = (): useParseWebClipReturns => {
  /**
   * URL のバリデーター
   * @param {string} urlString
   * @returns {Promise<boolean>}
   */
  const validateUrl = async (urlString: string): Promise<boolean> => {
    try {
      new URL(urlString);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * 指定したURLのTitleタグの値をパースする
   * @param {string} url
   * @returns {Promise<string>}
   */
  const getTitle = async (url: string): Promise<string> => {
    if (await validateUrl(url)) {
      const response = await fetch(url, { method: "GET" });
      const $ = cheerio.load(await response.text());
      return $("title").text();
    } else {
      await showToast({
        style: Toast.Style.Failure,
        title: ja.toast.error.invalidUrl.title,
        message: ja.toast.error.invalidUrl.message,
      });
      return "";
    }
  };

  return { getTitle, validateUrl };
};
