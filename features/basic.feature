Feature: 拜訪頁面
  測試用拜訪頁面

  Scenario: 測試測試
    Given 拜訪頁面
    Then 看到 "Member Login"

  Scenario: 管理員登入
    Given 拜訪頁面
    Then 看到 "Member Login" 
    Then 輸入在.ENV的信箱
    And 輸入在.ENV的密碼
    When 在 "openstack" 登入
    Then 看到 "Yish Lai"
