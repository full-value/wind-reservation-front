export type MessageType = 'text' | 'button' | 'select' | 'input' | 'reservationView' | 'viewReservationList' | 'selectDate' | 'checkReservation' |'updateReservation';

export interface ChatMessage {
  type: MessageType;
  content: string;
  options?: string[]; 
  delay?: number; 
  name?:string;
  column?:string[];
  option?:string[];
  reqType?:string[];
  state?:string;
}

// Use an index signature to define chatMessages as an object of multiple ChatMessage types
export const chatMessages: { [key: string]: ChatMessage } = {
  welcome: {
    type: 'button',    
    // content: '私たちのサイトにお越しいただきありがとうございます!🙂<br/>私は、Wingの予約管理エージェント、ジェームスです。工事予約の手続き承ります。<br/>予約の変更方法、その手続きについてご案内できます。<br/>どのようなお手伝いが必要でしょうか？',
    content: '私たちのサイトにお越しいただきありがとうございます!',
    options: ['新しい予約','予約変更', '予約照会'],
    reqType: ['select_requirement']
  },
  welcomeAgain:{
    type: 'button',    
    content: '私はどのようにもっとお手伝いできますか？',
    options: ['新しい予約','予約変更', '予約照会'],
    reqType: ['select_requirement']
  },
  viewReservationListError:{
    type: 'button',    
    content: '予約内容はありません。予約を進めますか？',
    options: ['新しい予約',],
    reqType: ['return']
  },
  新しい予約: {
    type: 'button',
    content: '申し訳ありませんが、エアコンの設置に関するいくつかの問題について、詳細をお知らせいただけますでしょうか?<br/>エアコンは何台設置でしょうか？　',
    options: ['１台','2台','3台','4台以上'],
    reqType: ['installationNum']
  },
  予約照会: {
    type: 'input',
    content: '恐れ入りますが、お名前をお聞かせいただけますでしょうか？',
    reqType: ['inputPhoneNum']
  },
  予約変更: {
      type: 'input',
      content: '恐れ入りますが、お名前をお聞かせいただけますでしょうか？',
      reqType: ['inputPhoneNum']
  },
  ResidentialType: {
    type: 'button',
    content: 'お住いのタイプは？',
    options: ['集合住','一戸建て'],
    reqType: ['BuildingType']
  },
  BuildingType: {
    type: 'button',
    content: '建物は？',
    options: ['新築','既築'],
    reqType: ['installationType']
  },
  installationType: {
    type: 'button',
    content: '新規設置でしょうか？入替工事でしょうか？',
    options: ['新規設置','入替工事'],
    reqType: ['isConsent']
  },
  isRecycleRequirement:{
    type: 'button',
    content: '古いエアコンのリサイクルは必要ですか？',
    options: ['リサイクル希望','リサイクルはしない'],
    reqType: ['isRecycleRequirement']
  },
  isConsent:{    
    type: 'button',
    content: 'エアコン専用コンセントはございますか？',
    options: ['ある','ない','わからない'],
    reqType: ['installationStatus']   
  },
  installationStatus:{
    type: 'button',
    content: '室内機と室外機の設置状況は？',
    options: ['室内機・室外機は同じ階に設置','室内機・室外機は1Fから2F（2Fから1F）に設置','室内機・室外機は1F-3F（3F→1F）に設置','室内機・室外機は2F-3F（3F→2F）に設置'],
    reqType: ['installationMethod']   
  },
  installationMethod:{
    type: 'button',
    content: '室内機と室外機の室外機外機の設置方法は？',
    options: ['地面置き・ベランダ置き','壁掛け新規','屋根置き新規','公団吊り新規','二段置き新規','金具再利用','わからない'],
    reqType: ['isHolePiping']   
  },
  constructionStartDate:{
    type: 'button',
    content: '着工日は２００６年８月以前ですか？',
    options: ['２００６年８月以前です。','２００６年９月以降です。'],
    reqType: ['constructionStartDate']   
  },
  isHolePiping:{
    type: 'button',
    content: '配管用の穴はございますか？',
    options: ['あり','なし'],
    reqType: ['isOutdoorDecorativeCoverRequired']   
  },
  isOutdoorDecorativeCoverRequired:{
    type: 'button',
    content: '室外化粧カバーは必要ですか？',
    options: ['希望なし','既存カバーの再利用','わからない','新規希望'],
    reqType: ['isIndoorDecorativeCoverRequired']  
  },
  isIndoorDecorativeCoverRequired:{
    type: 'button',
    content: '室内化粧カバーは必要ですか？',
    options: ['希望なし','新規希望','既存カバーの再利用','わからない'],
    reqType: ['inputName']  
  },
  selectColor:{
    type: 'button',
    content: '化粧カバーの色を１色選んでください。',
    options: ['アイボリー','ホワイト','ブラウン','ブラック','グレー','わからない'],
    reqType: ['selectedColor']  
  },
  inputName:{
    type: 'input',
    content: '恐れ入りますが、お名前をお聞かせいただけますでしょうか？',    
    reqType: ['inputAddress']  
  },
  inputAddress:{
    type: 'input',
    content: 'ご住所をお聞かせいただけますでしょうか？',    
    reqType: ['inputPhoneNum']
  },
  inputPhoneNum:{
    type: 'input',
    content: 'ご連絡させていただける電話番号を教えてください。',    
    reqType: ['selectDate']  
  },
  selectWorkDate:{
    type:'selectDate',
    content: '工事希望日を教えて下さい。',   
    reqType: ['selectTime']
  },
  selectTime:{
    type:'button',
    content: '選択した日付の空き時間を表示します。ご希望の時間帯を選択してください。',    
    reqType: ['reservationConfirmation']  
  },
  reservationConfirmation:{
    type: 'reservationView',    
    content: '以下の内容で予約を確定します。問題がなければ『はい』と入力してください。',        
    reqType: ['reservate']
  },
  bookedReservation:{
    type: 'checkReservation',
    content:'予約が確定しました。以下の内容をご確認ください。',
    state:"OK",
    reqType: ['EndBtn']
  },
  getReservationError:{
    type: 'button',
    content:'予約はありません。',
    options:["戻る"],
    reqType: ['EndBtn']
  },
  updateReservation:{
    type: 'updateReservation',
    content:'下記の予約を変更してもよろしいですか？',
    reqType: ['updateReservation']
  },
  updateReservationConfirm:{
    type: 'button',
    content:'予約を本当に変更しますか？',
    options:['はい','いいえ'],
    reqType: ['updateReservationConfirm']
  },



  

};
