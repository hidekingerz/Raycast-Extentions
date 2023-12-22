import fetch from "node-fetch";
import { URL } from "node:url";
import * as cheerio from "cheerio";
import { showToast, Toast } from "@raycast/api";

type useParseWebClipReturns = {
  getWebClipTitle: (url: string) => Promise<string>;
};

const validateUrl = async (urlString: string) => {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
};

export const useParseWebClip = (): useParseWebClipReturns => {
  const getWebClipTitle = async (url: string): Promise<string> => {
    if (await validateUrl(url)) {
      const response = await fetch(url, { method: "GET" });
      const $ = cheerio.load(await response.text());
      return $("title").text();
    } else {
      await showToast({ style: Toast.Style.Failure, title: "Invalid URL", message: "Enter URL" });
      return "";
    }
  };

  return { getWebClipTitle };
};
