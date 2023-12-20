import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useSendTweet } from "./hooks/useSendTweet";
import { useTweetValidator } from "./hooks/useTweetValidator";
import { FormValues } from "./lib/types/tweetContents";
import { getErrorMessage } from "./utils";

const defaultFormValues: FormValues = {
  body: "読んだ：",
  url: "",
  tag: ["#webclip"],
};

export default function Command() {
  const { createTweetContent, sendTweet } = useSendTweet();
  const { urlError, setUrlError, dropUrlErrorIfNeeded, bodyError, setBodyError, dropBodyErrorIfNeeded, validTweet } =
    useTweetValidator();

  const handleSubmit = async (values: FormValues) => {
    const tweet = createTweetContent(values);
    try {
      if (!validTweet(tweet)) {
        await showToast({ style: Toast.Style.Failure, title: "Invalid Tweet", message: "Tweets are not valid" });
        return;
      }
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
        onBlur={(event) => {
          if (event.target.value?.length == 0) {
            setBodyError("The field shouldn't be empty!");
          } else {
            dropBodyErrorIfNeeded();
          }
        }}
      />
      <Form.TextField
        id="url"
        title="URL"
        placeholder="Enter URL"
        error={urlError}
        defaultValue={defaultFormValues.url}
        onChange={dropUrlErrorIfNeeded}
        onBlur={(event) => {
          if (event.target.value?.length == 0) {
            setUrlError("The field shouldn't be empty!");
          } else {
            dropUrlErrorIfNeeded();
          }
        }}
      />
      <Form.Separator />
      <Form.TagPicker id="tag" title="Tag" defaultValue={defaultFormValues.tag}>
        <Form.TagPicker.Item value="#webclip" title="#webclip" />
      </Form.TagPicker>
    </Form>
  );
}
