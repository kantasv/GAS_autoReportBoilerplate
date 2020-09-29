//please open the file with Google Apps Script
function createReportBoilerplate(){
  //ここだけを毎回変更してレポートを作成します
  let courseTitle='ジャガイモ入門IA'
  let reportTitle='最終レポート'
  let teacher='ジャガイモ先端研究機構 田中マイケルジャクソン'
  let deadline='昭和32年4月45日'
  let formatDescription='B3棟の研究室にA4サイズでレポート提出必要, ジャガイモの画像を最低一枚添付する必要ありと講義スライドにあった'
  //たまにファイル名を指定してくる講義があるので、その場合はここにそれを入れます
  let fileNameRequirements=''
  //そうでなければ基本は
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
  body.replaceText('{{courseTitle}}',courseTitle)
  body.replaceText('{{reportTitle}}',reportTitle)
  body.replaceText('{{teacher}}',teacher)
  body.replaceText('{{deadline}}',deadline)
  body.replaceText('{{formatDescription}}',formatDescription)
}
