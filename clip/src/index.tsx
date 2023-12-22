import { ActionPanel, Action, showToast, Toast, Form, openExtensionPreferences } from "@raycast/api";
import { useTweet } from "./hooks/useTweet";
import { useFormValidator } from "./hooks/useFormValidator";
import { FormValues } from "./lib/types/tweetContents";
import { getErrorMessage } from "./utils";
import { useTweetValidator } from "./hooks/useTweetValidator";
import { useState } from "react";

const defaultFormValues: FormValues = {
  body: "読んだ：",
  url: "",
  tag: ["#webclip"],
};

export default function Command() {
  const [formValue, setFormValue] = useState(defaultFormValues);

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
        onChange={(newValue) => {
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
        onChange={(newValue) => {
          dropUrlErrorIfNeeded();
          setFormValue({ ...formValue, url: newValue });
        }}
        onBlur={handleUrlOnBlur}
      />
      <Form.Separator />
      <Form.TagPicker
        id="tag"
        title="Tag"
        defaultValue={defaultFormValues.tag}
        value={formValue.tag}
        onChange={(newValue) => {
          setFormValue({ ...formValue, tag: newValue });
        }}
      >
        <Form.TagPicker.Item value="#webclip" title="#webclip" />
      </Form.TagPicker>
    </Form>
  );
}
