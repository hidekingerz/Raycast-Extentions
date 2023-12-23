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
import ja from "./locale/ja.json";

const { prefix } = getPreferenceValues<Preferences>();
const defaultFormValues: FormValues = {
  body: prefix,
  url: "",
};

export default function Command() {
  const [formValue, setFormValue] = useState(defaultFormValues);

  const { getTitle, validateUrl } = useWebClip();
  const { validTweet } = useTweetValidator();
  const { createTweetContent, sendTweet } = useTweet();
  const { urlError, dropUrlErrorIfNeeded, handleUrlOnBlur, bodyError, handleBodyOnBlur, dropBodyErrorIfNeeded } =
    useFormValidator();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const isValidUrl = await validateUrl(formValue.url);
      console.log(isValidUrl);
      if (isValidUrl) {
        const title = await getTitle(formValue.url);
        const newTitle = defaultFormValues.body + title;
        setFormValue({ ...formValue, body: newTitle });
        return () => clearTimeout(timeout);
      }
    }, 1000);
  }, [formValue.url]);

  const handleSubmit = async (values: FormValues) => {
    const tweet = createTweetContent(values);

    if (!validTweet(tweet)) {
      await showToast({
        style: Toast.Style.Failure,
        title: ja.toast.error.invalidTweet.title,
        message: ja.toast.error.invalidTweet.message,
      });
      return;
    }

    try {
      await sendTweet(tweet.text);
      await showToast({ title: ja.toast.success.sendTweet.title, message: ja.toast.success.sendTweet.message });
      // 値を初期化
      setFormValue(defaultFormValues);
    } catch (error) {
      await showToast({ style: Toast.Style.Failure, title: "Error", message: getErrorMessage(error) });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title={ja.action.submit} onSubmit={handleSubmit} />
          <Action title={ja.action.openExtensionPreference} onAction={openExtensionPreferences} />
        </ActionPanel>
      }
    >
      <Form.Description text={ja.label.description} />
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
      <Form.TextArea
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
    </Form>
  );
}
