# GAS_autoReportBoilerplate
*以下の記事と同様のことをREADME.mdに記述してます
https://qiita.com/kanta_yamaoka/items/14d8a8e9aab7ab7933cf

#自動化の意義
こんにちは、大学生で自動化エンジニアの山岡幹太です。
日々各種自動化ツールを作成し生活をより便利にすることに快感を得ています。

大学のレポートの作成のとっかかりの障壁の一つに、レポートの雛形作成の手間が挙げられます。
例えば、学籍番号、所属、氏名、授業名などを手動で入力し、適切に右寄せ左寄せ、スタイルの設定をする必要があります。
しかし、こうした反復作業は必要なのにも関わらず、レポートの評価には寄与しません。
すなわち、人間がする必要のある作業ではありません。

反復的な作業はプログラマーにやらせましょう。
そこで今回はGoogle Apps Scriptでのレポートテンプレ作成の自動化のユースケースを共有します。

#GAS, Google Apps Scriptとは？
Googleのサービス,e.g.,表計算、ドキュメント作成などを一貫してJavaScriptの形式で操作できるスクリプトエディタ＆実行環境です。
自由度はきわめて高いです。

前回は、下ネタを検知して叱責するLINE BotをGASとともに作成しましたが、意外と好評でした。
「GASとLINE Botで下ネタメッセージを取り締まるボットを作成」
https://qiita.com/kanta_yamaoka/items/02a2521f526f72126fac
興味がございましたらご覧ください


#流れ

大まかにこれだけです：
1.テンプレートドキュメントの作成
2.GASのスクリプトの記述
3.GASへの権限の付与
4.関数の実行＆ファイル生成

ここまでできれば、授業で先生がレポートの情報を喋った瞬間に
GASでレポートの情報を入力し、関数を実行するだけでドキュメントが作成できます
あとは、レポートの中身の作成に集中できます

それでは Let's go!

#1.テンプレートドキュメントの作成
GASのスクリプトで後ほどこのようにしてテンプレートを作成し、中身の文字列を任意のものに書き換えます。
まず後ほど置換したい項目を{{}}で囲んで、フォントサイズや配置を決めます。
{{}}で囲んだのは、Vue.jsの表記を真似ただけなので、別に意図通りに置換できれば何でもいいのです。
「キン肉マン太郎」でもいいですが後ほど混乱を招くので、わかりやすい名前をつけましょう。
これのいいところは、GUIでテンプレートの編集が可能な点です。
*GASでスタイルをゴリゴリ編集するのは、面倒なので今回はやりません.


![スクリーンショット 2020-09-29 18.17.15.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/614389/855eb87e-2f45-208a-dd0a-17d6307d46f6.png)

次に、テンプレートドキュメントのドキュメントのIDを取得しましょう
テンプレートドキュメントのURLを開き,下の{document ID}の部分を取っておきましょう
このIDを次の段階で使います

```
https://docs.google.com/document/d/{document ID}/edit#
```

#2.GASのスクリプトの記述
Google Driveを開き、左上の「新規」ボタンを力を込めてクリック
![スクリーンショット 2020-09-29 18.25.03.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/614389/1285e3cc-6f08-f203-c6a9-35692dd4527d.png)
そして、「その他」を力強くクリックして、"Google Apps Script"を選びましょう
![スクリーンショット 2020-09-29 18.26.05.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/614389/4af8caef-c615-8862-4a77-659fb7670e96.png)

以下のスクリプトをコピペして、先ほど取得したテンプレートファイルのドキュメントIDを置き換えましょう

```js

function createReportBoilerplate(){
  //ここだけを毎回変更してレポートを作成します
  let courseTitle='ジャガイモ入門IA';
  let reportTitle='最終レポート';
  let teacher='ジャガイモ先端研究機構 田中マイケルジャクソン';
  let deadline='昭和32年4月45日';
  let formatDescription='B3棟の研究室にA4サイズでレポート提出必要, ジャガイモの画像を最低一枚添付する必要ありと講義スライドにあった';
  //たまにファイル名を指定してくる講義があるので、その場合はここにそれを入れ、指示通りのファイル名のドキュメントを出力します
  let fileNameRequirements='';
  //そうでなければ基本、ファイル名は
  //　`${fileNameRequirements}締め切り:${deadline},${courseTitle} `
  //　のファイル名で保存します。締め切りは何よりも大事だからです。

  //テンプレートファイルのドキュメントIDを以下に記述します
  //  https://docs.google.com/document/d/{document ID}/edit#
  let docID = '1grjjqEkpBQCcYkZ84gDjml8afyioRwhq1C2WWOGdSHQ';
  
  //テンプレートからコピーの作成
  let templateDoc = DriveApp.getFileById(docID);
  //ファイル名を識別しやすい形で指定
  let createdDoc = templateDoc.makeCopy(`${fileNameRequirements}締め切り:${deadline},${courseTitle} `);

  //コピー後のドキュメントの本文を取得します
  let body = DocumentApp.openById(createdDoc.getId()).getBody();
  
  //本文中の{{}}, mustache tagsを任意の文字列に置換します
  body.replaceText('{{courseTitle}}',courseTitle);
  body.replaceText('{{reportTitle}}',reportTitle);
  body.replaceText('{{teacher}}',teacher);
  body.replaceText('{{deadline}}',deadline);
  body.replaceText('{{formatDescription}}',formatDescription);
}


```

そのあと、スクリプトをctrl+sで保存し、以下の要領で実行します
![スクリーンショット 2020-09-29 18.36.09.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/614389/024bbee8-efc2-d815-bbeb-b4e80261f787.png)

#3.GASへの権限の付与
Googleアカウントへの権限許可の画面に飛ぶので、「許可を確認」を力強くクリックしましょう
なお、スクリプトファイルはGoogleアカウントでほとんどのことができてしまうので、
取り扱いに十分気を付けましょう
![スクリーンショット 2020-09-29 18.47.17.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/614389/1e3d9d7c-eeb2-3eb8-dfd7-6cc10ff02155.png)

先への進み方がわかりづらいですが、画像のように下の「詳細」をクリックしましょう

![スクリーンショット 2020-09-29 18.47.33.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/614389/19c842a9-e183-25c7-29cc-e3b07d0cdea7.png)

さらにわかりづらいですが、画像のように「（プロジェクト名）安全ではないページに移動」を力を込めてクリックしましょう！

![スクリーンショット 2020-09-29 18.52.11.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/614389/8e0600c6-236c-ac2a-057a-e3e6d178a57f.png)

そのあとは、画面にしたがって権限付与を完了してください

#3.関数の実行＆ファイル生成
Voila! Google Driveを開くと、お望み通りのドキュメントが新規作成されています
いったんこのスクリプトを作成してしまえば、甘美な大学生活が確約されたようなものです。
レポート作成の時の障壁となる毎回の学生情報の入力や、スタイルの変更の手間が省けて、
迅速にレポートに集中して取り組むことができます。
そして、余った可処分時間でより一層大学生活をサークルと恋愛で埋め尽くせます！（理論上）

![スクリーンショット 2020-09-29 18.55.32.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/614389/b0c20c88-88b9-979a-70c6-21d20fc661cc.png)


#ハマったところ
##Arrow演算子を使うと、GASの実行メニューに関数が表示されない
Arrow演算子ファンの皆さん、Arrow演算子かっこいいですよね

```js

let warabimochi = (kome, yasai, kinoko)=>{
  ...
}

```

でもGASでは関数定義はできても、GASの実行メニューに関数が表示されず使えないみたいです...
ランタイムがV8エンジンになったらしいですし、今後改善されるといいですね！

とりあえず、従来の関数定義の形で書きましょう！

```js

function warabimochi(kome,yasai,kinoko){
   ...
}
```

#応用の可能性は多岐にわたる

例えば、会社で顧客の名前などが入ったドキュメントなどを作成する時に、
いちいちファイルをコピーし名前をつけて、開き、該当部分を見つけて手動で入力などしていませんか？
GASを使えばこの手間を削減でき、ヒューマンエラーも減らせます。
特にスプレッドシートと連携すれば、より効率的にテンプレートからの文書作成ができます。

スプレッドシートとの連携の私の大学生活でのユースケースを次回は紹介いたします。
それではお楽しみに！

あなたはGASでどんなことをを便利にしますか？コメントどしどしお待ちしています！
