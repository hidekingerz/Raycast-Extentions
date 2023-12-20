import { ActionPanel, Action, showToast, Toast, Form } from "@raycast/api";
import { useTweet } from "./hooks/useTweet";
import { useFormValidator } from "./hooks/useFormValidator";
import { FormValues } from "./lib/types/tweetContents";
import { getErrorMessage } from "./utils";
import { useTweetValidator } from "./hooks/useTweetValidator";

const defaultFormValues: FormValues = {
  body: "読んだ：",
  url: "",
  tag: ["#webclip"],
};

export default function Command() {
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
    } catch (error) {
      await showToast({ style: Toast.Style.Failure, title: "Error", message: getErrorMessage(error) });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
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
        onChange={dropBodyErrorIfNeeded}
        onBlur={handleBodyOnBlur}
      />
      <Form.TextField
        id="url"
        title="URL"
        placeholder="Enter URL"
        error={urlError}
        defaultValue={defaultFormValues.url}
        onChange={dropUrlErrorIfNeeded}
        onBlur={handleUrlOnBlur}
      />
      <Form.Separator />
      <Form.TagPicker id="tag" title="Tag" defaultValue={defaultFormValues.tag}>
        <Form.TagPicker.Item value="#webclip" title="#webclip" />
      </Form.TagPicker>
    </Form>
  );
}
