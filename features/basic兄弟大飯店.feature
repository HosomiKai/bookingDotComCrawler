Feature: Hotel搜尋價格
  拜訪旅館頁面
 Scenario: 搜尋 兄弟大飯店
 Given 拜訪頁面
 Then 看到 "您想去哪裡"
 Then 輸入飯店 "兄弟大飯店"
 Then 看到 "搜尋"
 Then 選擇入住時間 2022 3 3
 Then 查價錢
