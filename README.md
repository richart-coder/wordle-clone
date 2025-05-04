# Wordle Clone

一個使用現代網頁技術構建的熱門猜詞遊戲 Wordle 的簡易複刻版。

## 描述 (Description)

本專案是 Wordle 的網頁實作版本。玩家有六次機會猜出一個五個字母的目標單詞。每次猜測後，遊戲會提供關於字母的回饋：

- **綠色:** 字母正確且位置正確。
- **黃色:** 字母存在於單詞中，但位置錯誤。
- **灰色:** 字母不在目標單詞中。

## 功能 (Features)

- 經典 Wordle 玩法 (6 次嘗試，5 個字母的單詞)。
- 對猜測字母的顏色提示。
- 鍵盤輸入處理 (字母, Backspace, Enter)。
- 輸入驗證 (檢查是否為 5 個字母)。
- 單詞驗證 (檢查猜測是否為預定義列表中的有效單詞)。
- 使用 Toast 通知提供回饋 (例如：「不在單詞列表中」、「恭喜！」)。
- 基礎的響應式設計。

## 技術棧 (Tech Stack)

- **框架 (Framework):** [Next.js](https://nextjs.org/) (React 框架)
- **語言 (Language):** [TypeScript](https://www.typescriptlang.org/)
- **樣式 (Styling):** [Tailwind CSS](https://tailwindcss.com/)
- **狀態管理 (State Management):** React Hooks (`useReducer`, `useRef`)
- **通知 (Notifications):** [react-toastify](https://fkhadra.github.io/react-toastify/)

## 開始使用 (Getting Started)

### 先決條件 (Prerequisites)

- [Node.js](https://nodejs.org/) (建議 v18 或更高版本)
- [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/)

### 安裝與設定 (Installation & Setup)

1.  **克隆儲存庫 (Clone the repository):**

    ```bash
    git clone https://github.com/richart-coder/wordle-clone.git
    cd wordle-clone
    ```

2.  **安裝依賴項 (Install dependencies):**

    ```bash
    npm install
    # 或
    # yarn install
    ```

3.  **(可選) 更新單詞列表 (Update Word List):** 目前的單詞列表硬編碼在 `src/app/api/words/route.ts` 中。您可以直接修改此列表，或者更新 API 路由以從檔案讀取。

### 運行開發伺服器 (Running the Development Server)

```bash
npm run dev
# 或
yarn dev
```

在您的瀏覽器中開啟 [http://localhost:3000](http://localhost:3000) 來查看遊戲。

## 如何遊玩 (How to Play)

1.  您有六次機會猜出五個字母的秘密單詞。
2.  使用鍵盤輸入您的猜測。
3.  按 Enter 鍵提交您的猜測。
4.  方塊的顏色將會改變，以顯示您的猜測與目標單詞的接近程度。
5.  利用回饋來推斷秘密單詞。

## 專案結構 (Project Structure) (簡化)

```
|-- src/
|   |-- app/
|   |   |-- api/words/
|   |   |   `-- route.ts
|   |   |-- favicon.ico
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   `-- page.tsx
|   |-- components/
|   |   |-- Line.tsx
|   |   `-- Wordle.tsx
|   |-- features/wordle/
|   |   |-- context.ts
|   |   |-- domain.ts
|   |   `-- logic.ts
|   `-- lib/
|       `-- util.ts
```

## 了解更多 (Learn More)

若想了解更多關於 Next.js 的資訊，請參考以下資源：

- [Next.js Documentation](https://nextjs.org/docs) - 了解 Next.js 功能和 API。
- [Learn Next.js](https://nextjs.org/learn) - 一個互動式的 Next.js 教學。

您可以查看 [Next.js GitHub repository](https://github.com/vercel/next.js) - 歡迎您的回饋和貢獻！

## 在 Vercel 上部署 (Deploy on Vercel)

部署您的 Next.js 應用最簡單的方式是使用由 Next.js 創作者提供的 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

更多細節請查看我們的 [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)。
