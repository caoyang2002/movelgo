// import { languages } from 'monaco-editor/esm/vs/editor/editor.api'
// import {
//   setupLanguageFeatures,
//   LanguageIdEnum,
//   CompletionService,
//   ICompletionItem,
//   SyntaxContextType,
// } from 'monaco-sql-languages'

// const completionService: CompletionService = function (
//   model,
//   position,
//   completionContext,
//   suggestions, // 语法推荐信息
//   entities // 当前编辑器文本的语法上下文中出现的表名、字段名等
// ) {
//   return new Promise((resolve, reject) => {
//     if (!suggestions) {
//       return Promise.resolve([])
//     }
//     const { keywords, syntax } = suggestions
//     const keywordsCompletionItems: ICompletionItem[] = keywords.map((kw) => ({
//       label: kw,
//       kind: languages.CompletionItemKind.Keyword,
//       detail: 'keyword',
//       sortText: '2' + kw,
//     }))

//     let syntaxCompletionItems: ICompletionItem[] = []

//     syntax.forEach((item) => {
//       if (item.syntaxContextType === SyntaxContextType.DATABASE) {
//         const databaseCompletions: ICompletionItem[] = [] // some completions about databaseName
//         syntaxCompletionItems = [
//           ...syntaxCompletionItems,
//           ...databaseCompletions,
//         ]
//       }
//       if (item.syntaxContextType === SyntaxContextType.TABLE) {
//         const tableCompletions: ICompletionItem[] = [] // some completions about tableName
//         syntaxCompletionItems = [...syntaxCompletionItems, ...tableCompletions]
//       }
//     })

//     resolve([...syntaxCompletionItems, ...keywordsCompletionItems])
//   })
// }

// setupLanguageFeatures(LanguageIdEnum.FLINK, {
//   completionItems: {
//     enable: true,
//     completionService,
//   },
// })

export {}
