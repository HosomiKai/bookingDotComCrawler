Feature: Hotel搜尋價格
  拜訪旅館頁面
 Scenario: 搜尋 兄弟大飯店
 Given 拜訪頁面
 Then 看到目的地
 Then 輸入飯店 "兄弟大飯店"
 Then 選擇入住時間 2022 6 23
 Then 選旅館
 Then 查價錢
