import {
  Action,
  ActionPanel,
  Form,
  openExtensionPreferences,
  getPreferenceValues,
  showToast,
  Toast,
} from "@raycast/api";
import { FormValues } from "./lib/types/tweetContents";
import { getErrorMessage } from "./utils";
import { useTweet } from "./hooks/useTweet";
import { useFormValidator } from "./hooks/useFormValidator";
import { useTweetValidator } from "./hooks/useTweetValidator";
import { useEffect, useState } from "react";
import { useWebClip } from "./hooks/useWebClip";

const { prefix } = getPreferenceValues<Preferences>();

const defaultFormValues: FormValues = {
  body: prefix,
  url: "",
};

export default function Command() {
  const [formValue, setFormValue] = useState(defaultFormValues);

  const { getTitle } = useWebClip();
  const { validTweet } = useTweetValidator();
  const { createTweetContent, sendTweet } = useTweet();
  const { urlError, dropUrlErrorIfNeeded, handleUrlOnBlur, bodyError, handleBodyOnBlur, dropBodyErrorIfNeeded } =
    useFormValidator();

  const handleSubmit = async (values: FormValues) => {
    const tweet = createTweetContent(values);

    if (!validTweet(tweet)) {
      await showToast({ style: Toast.Style.Failure, title: "Invalid Tweet", message: "Tweets are not valid" });
      return;
    }

    try {
      await sendTweet(tweet.text);
      await showToast({ title: "Tweet success!", message: "See X" });
      // 値を初期化
      setFormValue(defaultFormValues);
    } catch (error) {
      await showToast({ style: Toast.Style.Failure, title: "Error", message: getErrorMessage(error) });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!urlError) {
        const title = await getTitle(formValue.url);
        const newTitle = defaultFormValues.body + title;
        setFormValue({ ...formValue, body: newTitle });
        return () => clearTimeout(timeout);
      }
    }, 1000);
  }, [formValue.url]);

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
          <Action title="Open Extension Preferences" onAction={openExtensionPreferences} />
        </ActionPanel>
      }
    >
      <Form.Description text="保管したいWeb記事をClip" />
      <Form.TextField
        id="body"
        title={"Body"}
        placeholder={"Enter body"}
        error={bodyError}
        defaultValue={defaultFormValues.body}
        value={formValue.body}
        onChange={async (newValue) => {
          dropBodyErrorIfNeeded();
          setFormValue({ ...formValue, body: newValue });
        }}
        onBlur={handleBodyOnBlur}
      />
      <Form.TextField
        id="url"
        title="URL"
        autoFocus={true}
        placeholder="Enter URL"
        error={urlError}
        defaultValue={defaultFormValues.url}
        value={formValue.url}
        onChange={async (newValue) => {
          dropUrlErrorIfNeeded();
          setFormValue({ ...formValue, url: newValue });
        }}
        onBlur={handleUrlOnBlur}
      />
    </Form>
  );
}
