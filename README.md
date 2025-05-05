---
marp: true
theme: default
paginate: true
backgroundColor: #f5f5f5
style: |
  section {
    font-family: 'Microsoft JhengHei', 'PingFang TC', sans-serif;
  }
  h1, h2, h3 {
    color: #2c3e50;
  }
  code {
    background-color: #f0f0f0;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }
---

<!-- _backgroundColor: #2c3e50 -->
<!-- _color: white -->

# Wordle Clone

### 一個使用現代網頁技術構建的熱門猜詞遊戲

---

## 專案描述

本專案是 Wordle 的網頁實作版本：

- 玩家有六次機會猜出一個五個字母的目標單詞
- 每次猜測後，遊戲提供回饋：
  - **綠色:** 字母正確且位置正確
  - **黃色:** 字母存在但位置錯誤
  - **灰色:** 字母不在目標單詞中

---

## 核心功能

- 經典 Wordle 玩法 (6 次嘗試，5 個字母的單詞)
- 對猜測字母的顏色提示
- 鍵盤輸入處理 (字母, Backspace, Enter)
- 輸入及單詞有效性驗證
- Toast 通知系統提供即時回饋
- 響應式設計，適應各種螢幕尺寸

---

<!-- _backgroundColor: #34495e -->
<!-- _color: white -->

## 技術棧

![bg right:40% 80%](https://nextjs.org/api/placeholder/400/320)

- **框架:** Next.js (React)
- **語言:** TypeScript
- **樣式:** Tailwind CSS
- **狀態管理:** React Hooks
  - useReducer
  - useRef
- **通知:** react-toastify

---

## 開始使用

### 先決條件

- Node.js (建議 v18+)
- npm 或 yarn

---

## 安裝與設定

```bash
# 克隆儲存庫
git clone https://github.com/richart-coder/wordle-clone.git
cd wordle-clone

# 安裝依賴項
npm install
# 或
yarn install

# 啟動開發伺服器
npm run dev
# 或
yarn dev
```

---

<!-- _backgroundColor: #2c3e50 -->
<!-- _color: white -->

## 如何遊玩

1. 您有**六次**機會猜出五個字母的秘密單詞
2. 使用鍵盤輸入您的猜測
3. 按 **Enter** 鍵提交猜測
4. 方塊顏色將會改變，顯示猜測的準確性
5. 利用顏色回饋來推斷秘密單詞

---

## 專案結構

```
src/
├── app/
│   ├── api/words/
│   │   └── route.ts      # 單詞 API
│   ├── layout.tsx        # 應用佈局
│   └── page.tsx          # 主頁面
├── components/
│   ├── Line.tsx          # 單行組件
│   └── Wordle.tsx        # 主遊戲組件
└── features/wordle/
    ├── context.ts        # 遊戲上下文
    ├── domain.ts         # 領域模型
    └── logic.ts          # 遊戲邏輯
```

---

<!-- _backgroundColor: #27ae60 -->
<!-- _color: white -->

## 部署選項

- 最簡單方式：[Vercel Platform](https://vercel.com)
- 完全兼容 Next.js
- 支持自動部署
- 零配置 CI/CD

---

<!-- _backgroundColor: #2c3e50 -->
<!-- _color: white -->

# 謝謝！

### 歡迎提問與貢獻
