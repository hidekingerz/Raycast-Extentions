import { useEffect, useState } from "react";
import { ActionPanel, List, Action } from "@raycast/api";
import Parser from "rss-parser";

export function StoryListItem(props: { item: Parser.Item; index: number }) {
  const [state, setState] = useState<{ icon: string }>({
    icon: getIcon(100),
  });

  useEffect(() => {
    const icon = getIcon(props.index + 1);
    setState({ icon });
  }, [props.item, props.index]);

  return (
    <List.Item
      icon={state.icon}
      title={props.item.title ?? "No title"}
      subtitle={props.item.pubDate}
      actions={<Actions item={props.item} />}
    />
  );
}

function Actions(props: { item: Parser.Item }) {
  return (
    <ActionPanel title={props.item.title}>
      <ActionPanel.Section>{props.item.link && <Action.OpenInBrowser url={props.item.link} />}</ActionPanel.Section>
      <ActionPanel.Section>
        {props.item.link && (
          <Action.CopyToClipboard
            content={props.item.link}
            title="Copy Link"
            shortcut={{ modifiers: ["cmd"], key: "." }}
          />
        )}
      </ActionPanel.Section>
    </ActionPanel>
  );
}

const iconToEmojiMap = new Map<number, string>([
  [1, "1️⃣"],
  [2, "2️⃣"],
  [3, "3️⃣"],
  [4, "4️⃣"],
  [5, "5️⃣"],
  [6, "6️⃣"],
  [7, "7️⃣"],
  [8, "8️⃣"],
  [9, "9️⃣"],
  [10, "🔟"],
]);

function getIcon(index: number) {
  return iconToEmojiMap.get(index) ?? "⏺";
}
