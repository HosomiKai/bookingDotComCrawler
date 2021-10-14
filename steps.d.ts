/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file.js');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any }
  interface Methods extends Playwright {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {
  "amOutsideAngularApp": "在Angular應用外",
  "amInsideAngularApp": "在Angular應用內",
  "waitForElement": "等待元素",
  "waitForClickable": "等到可點擊",
  "waitForVisible": "等到可見",
  "waitForText": "等待文字",
  "moveTo": "移至",
  "refresh": "刷新",
  "haveModule": "有模組",
  "resetModule": "重置模組",
  "amOnPage": "在頁面",
  "click": "單擊",
  "doubleClick": "雙擊",
  "see": "看到",
  "dontSee": "看不到",
  "selectOption": "選中選項",
  "fillField": "填寫欄位",
  "pressKey": "按鍵",
  "triggerMouseEvent": "觸發滑鼠事件",
  "attachFile": "附加檔案",
  "seeInField": "在欄位中看到",
  "dontSeeInField": "在欄位中看不到",
  "appendField": "追加欄位",
  "checkOption": "勾選選項",
  "seeCheckboxIsChecked": "看到複選框勾選",
  "dontSeeCheckboxIsChecked": "看不到複選框勾選",
  "grabTextFrom": "抓取文字",
  "grabValueFrom": "抓取實值",
  "grabAttributeFrom": "抓取屬性",
  "seeInTitle": "在標題中看到",
  "dontSeeInTitle": "在標題中看不到",
  "grabTitle": "抓取標題",
  "seeElement": "看到元素",
  "dontSeeElement": "看不到元素",
  "seeInSource": "在原始碼中看到",
  "dontSeeInSource": "在原始碼中看不到",
  "executeScript": "执行指令碼",
  "executeAsyncScript": "执行非同步指令碼",
  "seeInCurrentUrl": "在當前網址中看到",
  "dontSeeInCurrentUrl": "在當前網址中看不到",
  "seeCurrentUrlEquals": "看到當前網址等於",
  "dontSeeCurrentUrlEquals": "看不到當前網址等於",
  "saveScreenshot": "儲存屏幕截圖",
  "setCookie": "設置Cookie",
  "clearCookie": "清空Cookie",
  "seeCookie": "看到Cookie",
  "dontSeeCookie": "看不到Cookie",
  "grabCookie": "抓取Cookie",
  "resizeWindow": "調整窗口尺寸",
  "wait": "等"
}
  }
}