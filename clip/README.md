# Clip

Clip web links

## Twitter

指定したURLをツイートします。  
URLを入力すると、対象ウェブサイトのタイトルを自動取得してBodyに埋め込みます。

#### Preferences

| name     | default    | required | description                                                                                       |
|----------|------------|:---------|:--------------------------------------------------------------------------------------------------|
| clientId | -          | o        | clientIdには、下記URLで登録したclientIdを設定してください。<br>see: https://developer.twitter.com/en/portal/dashboard |
| prefix   | "Reading:" | o        | ボディに埋め込む                                                                                          |
| tag      | "#webclip" | o        | string                                                                                            |
