import { List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { startCase } from "lodash";
import Parser from "rss-parser";
import { StoryListItem } from "./StoryListItem";

enum Topic {
  TopPicks = "top-picks",
  Domestic = "domestic",
  Business = "business",
  IT = "it",
}

interface State {
  isLoading: boolean;
  items?: Parser.Item[];
  topic: Topic | null;
  error?: Error;
}

const parser = new Parser();

export default function Command() {
  const [state, setState] = useState<State>({ items: [], isLoading: true, topic: null });

  useEffect(() => {
    if (!state.topic) {
      return;
    }

    async function fetchStories() {
      setState((previous) => ({ ...previous, isLoading: true }));
      try {
        const feed = await parser.parseURL(`https://news.yahoo.co.jp/rss/topics/${state.topic}.xml`);
        setState((previous) => ({ ...previous, items: feed.items, isLoading: false }));
      } catch (error) {
        setState((previous) => ({
          ...previous,
          error: error instanceof Error ? error : new Error("Yahoo news parse error"),
          isLoading: false,
          items: [],
        }));
      }
    }
    fetchStories();
  }, [state.topic]);

  useEffect(() => {
    if (state.error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed loading stories",
        message: state.error.message,
      });
    }
  }, [state.error]);

  console.log(state.items);

  return (
    <List
      isLoading={(!state.items && !state.error) || state.isLoading}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Page"
          storeValue
          onChange={(newValue) => setState((previous) => ({ ...previous, topic: newValue as Topic }))}
        >
          {Object.entries(Topic).map(([name, value]) => (
            <List.Dropdown.Item key={value} title={startCase(name)} value={value} />
          ))}
        </List.Dropdown>
      }
    >
      {state.items?.map((item, index) => (
        <StoryListItem key={item.guid} item={item} index={index} />
      ))}
    </List>
  );
}
