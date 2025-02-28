"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/chat/page",{

/***/ "(app-pages-browser)/./components/message-content.tsx":
/*!****************************************!*\
  !*** ./components/message-content.tsx ***!
  \****************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   MessageContent: function() { return /* binding */ MessageContent; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-themes */ \"(app-pages-browser)/./node_modules/next-themes/dist/index.module.js\");\n/* harmony import */ var react_markdown__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-markdown */ \"(app-pages-browser)/./node_modules/react-markdown/lib/index.js\");\n/* harmony import */ var react_syntax_highlighter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-syntax-highlighter */ \"(app-pages-browser)/./node_modules/react-syntax-highlighter/dist/esm/prism.js\");\n/* harmony import */ var react_syntax_highlighter_dist_cjs_styles_prism__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-syntax-highlighter/dist/cjs/styles/prism */ \"(app-pages-browser)/./node_modules/react-syntax-highlighter/dist/cjs/styles/prism/index.js\");\n/* harmony import */ var remark_gfm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! remark-gfm */ \"(app-pages-browser)/./node_modules/remark-gfm/lib/index.js\");\n/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/utils */ \"(app-pages-browser)/./lib/utils.ts\");\n/* harmony import */ var _barrel_optimize_names_Bot_User_lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! __barrel_optimize__?names=Bot,User!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/user.js\");\n/* harmony import */ var _barrel_optimize_names_Bot_User_lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! __barrel_optimize__?names=Bot,User!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/bot.js\");\n/* __next_internal_client_entry_do_not_use__ MessageContent auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\n\nfunction MessageContent(param) {\n    let { message } = param;\n    _s();\n    const { resolvedTheme } = (0,next_themes__WEBPACK_IMPORTED_MODULE_2__.useTheme)();\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        setMounted(true);\n    }, []);\n    // Don't server-render SyntaxHighlighter to avoid hydration mismatch\n    const codeComponent = (param)=>{\n        let { node, inline, className, children, ...props } = param;\n        // Don't use SyntaxHighlighter until client-side\n        if (!mounted) return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"code\", {\n            className: className,\n            ...props,\n            children: children\n        }, void 0, false, {\n            fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n            lineNumber: 40,\n            columnNumber: 26\n        }, this);\n        const match = /language-(\\w+)/.exec(className || \"\");\n        const language = match ? match[1] : \"text\";\n        return !inline && match ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_syntax_highlighter__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n            language: language,\n            PreTag: \"div\",\n            style: resolvedTheme === \"dark\" ? react_syntax_highlighter_dist_cjs_styles_prism__WEBPACK_IMPORTED_MODULE_5__.oneDark : react_syntax_highlighter_dist_cjs_styles_prism__WEBPACK_IMPORTED_MODULE_5__.oneLight,\n            wrapLines: true,\n            showLineNumbers: true,\n            ...props,\n            children: String(children).replace(/\\n$/, \"\")\n        }, void 0, false, {\n            fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n            lineNumber: 46,\n            columnNumber: 7\n        }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"code\", {\n            className: className,\n            ...props,\n            children: children\n        }, void 0, false, {\n            fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n            lineNumber: 57,\n            columnNumber: 7\n        }, this);\n    };\n    // 处理新消息格式，提取文本内容\n    const getMessageText = (content)=>{\n        // 处理旧的字符串格式消息（向后兼容）\n        if (typeof content === \"string\") {\n            return content;\n        }\n        // 处理新的数组格式消息\n        if (Array.isArray(content)) {\n            return content.filter((item)=>item.type === \"text\").map((item)=>item.text).join(\"\\n\");\n        }\n        return \"\";\n    };\n    // 渲染消息的 Markdown 内容\n    const renderContent = ()=>{\n        const text = getMessageText(message.content);\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_markdown__WEBPACK_IMPORTED_MODULE_6__.Markdown, {\n            className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)(\"prose prose-slate dark:prose-invert max-w-none\", \"prose-headings:font-semibold prose-headings:tracking-tight\", \"prose-h1:text-xl prose-h2:text-lg prose-h3:text-base\", \"prose-p:leading-normal prose-p:my-2\", \"prose-pre:bg-slate-100 prose-pre:dark:bg-slate-900 prose-pre:p-0\", \"prose-code:bg-slate-100 prose-code:dark:bg-slate-800 prose-code:font-medium prose-code:rounded prose-code:px-1\", \"break-words overflow-hidden\"),\n            remarkPlugins: [\n                remark_gfm__WEBPACK_IMPORTED_MODULE_7__[\"default\"]\n            ],\n            components: {\n                code: codeComponent,\n                // 自定义链接，添加目标属性和样式\n                a: (param)=>{\n                    let { node, ...props } = param;\n                    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"a\", {\n                        ...props,\n                        target: \"_blank\",\n                        rel: \"noopener noreferrer\",\n                        className: \"text-primary underline\"\n                    }, void 0, false, {\n                        fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n                        lineNumber: 101,\n                        columnNumber: 13\n                    }, void 0);\n                }\n            },\n            children: text\n        }, void 0, false, {\n            fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n            lineNumber: 86,\n            columnNumber: 7\n        }, this);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)(\"flex items-start gap-4 p-4 mb-3 mx-2 rounded-2xl\", message.role === \"user\" ? \"bg-background chat-message-user\" : \"bg-muted/30 chat-message-assistant\"),\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)(\"flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full\", message.role === \"user\" ? \"bg-primary text-primary-foreground\" : \"bg-muted text-muted-foreground\"),\n                children: message.role === \"user\" ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Bot_User_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"], {\n                    className: \"h-5 w-5\"\n                }, void 0, false, {\n                    fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n                    lineNumber: 126,\n                    columnNumber: 11\n                }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Bot_User_lucide_react__WEBPACK_IMPORTED_MODULE_9__[\"default\"], {\n                    className: \"h-5 w-5\"\n                }, void 0, false, {\n                    fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n                    lineNumber: 128,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n                lineNumber: 119,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex-1 space-y-2\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"flex items-center gap-2\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"font-medium\",\n                                children: [\n                                    message.role === \"user\" ? \"你\" : \"BenChat\",\n                                    message.model && message.role === \"assistant\" && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                        className: \"ml-2 text-xs font-normal text-muted-foreground\",\n                                        children: message.model\n                                    }, void 0, false, {\n                                        fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n                                        lineNumber: 139,\n                                        columnNumber: 15\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n                                lineNumber: 136,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"text-xs text-muted-foreground\",\n                                children: message.createdAt && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"time\", {\n                                    dateTime: message.createdAt.toISOString(),\n                                    children: new Intl.DateTimeFormat(\"zh-CN\", {\n                                        hour: \"2-digit\",\n                                        minute: \"2-digit\",\n                                        hour12: false\n                                    }).format(message.createdAt)\n                                }, void 0, false, {\n                                    fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n                                    lineNumber: 146,\n                                    columnNumber: 15\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n                                lineNumber: 144,\n                                columnNumber: 11\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n                        lineNumber: 135,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"prose-container\",\n                        children: renderContent()\n                    }, void 0, false, {\n                        fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n                        lineNumber: 158,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n                lineNumber: 133,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"D:\\\\马本江\\\\桌面\\\\modelcenter\\\\claude-clone\\\\components\\\\message-content.tsx\",\n        lineNumber: 112,\n        columnNumber: 5\n    }, this);\n}\n_s(MessageContent, \"7mWKygn7kk6b3+dTNlroOqQjeIs=\", false, function() {\n    return [\n        next_themes__WEBPACK_IMPORTED_MODULE_2__.useTheme\n    ];\n});\n_c = MessageContent;\nvar _c;\n$RefreshReg$(_c, \"MessageContent\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvbWVzc2FnZS1jb250ZW50LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUUyQztBQUNMO0FBQ0k7QUFDMkI7QUFDYTtBQUNoRDtBQUNGO0FBRVE7QUFrQmpDLFNBQVNZLGVBQWUsS0FBZ0M7UUFBaEMsRUFBRUMsT0FBTyxFQUF1QixHQUFoQzs7SUFDN0IsTUFBTSxFQUFFQyxhQUFhLEVBQUUsR0FBR1oscURBQVFBO0lBQ2xDLE1BQU0sQ0FBQ2EsU0FBU0MsV0FBVyxHQUFHaEIsK0NBQVFBLENBQUM7SUFFdkNDLGdEQUFTQSxDQUFDO1FBQ1JlLFdBQVc7SUFDYixHQUFHLEVBQUU7SUFFTCxvRUFBb0U7SUFDcEUsTUFBTUMsZ0JBQWdCO1lBQUMsRUFBRUMsSUFBSSxFQUFFQyxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsUUFBUSxFQUFFLEdBQUdDLE9BQWtCO1FBQy9FLGdEQUFnRDtRQUNoRCxJQUFJLENBQUNQLFNBQVMscUJBQU8sOERBQUNRO1lBQUtILFdBQVdBO1lBQVksR0FBR0UsS0FBSztzQkFBR0Q7Ozs7OztRQUU3RCxNQUFNRyxRQUFRLGlCQUFpQkMsSUFBSSxDQUFDTCxhQUFhO1FBQ2pELE1BQU1NLFdBQVdGLFFBQVFBLEtBQUssQ0FBQyxFQUFFLEdBQUc7UUFFcEMsT0FBTyxDQUFDTCxVQUFVSyxzQkFDaEIsOERBQUNuQixnRUFBaUJBO1lBQ2hCcUIsVUFBVUE7WUFDVkMsUUFBTztZQUNQQyxPQUFPZCxrQkFBa0IsU0FBU1IsbUZBQU9BLEdBQUdDLG9GQUFRQTtZQUNwRHNCLFdBQVc7WUFDWEMsaUJBQWlCO1lBQ2hCLEdBQUdSLEtBQUs7c0JBRVJTLE9BQU9WLFVBQVVXLE9BQU8sQ0FBQyxPQUFPOzs7OztpQ0FHbkMsOERBQUNUO1lBQUtILFdBQVdBO1lBQVksR0FBR0UsS0FBSztzQkFDbENEOzs7Ozs7SUFHUDtJQUVBLGlCQUFpQjtJQUNqQixNQUFNWSxpQkFBaUIsQ0FBQ0M7UUFDdEIsb0JBQW9CO1FBQ3BCLElBQUksT0FBT0EsWUFBWSxVQUFVO1lBQy9CLE9BQU9BO1FBQ1Q7UUFFQSxhQUFhO1FBQ2IsSUFBSUMsTUFBTUMsT0FBTyxDQUFDRixVQUFVO1lBQzFCLE9BQU9BLFFBQ0pHLE1BQU0sQ0FBQ0MsQ0FBQUEsT0FBUUEsS0FBS0MsSUFBSSxLQUFLLFFBQzdCQyxHQUFHLENBQUNGLENBQUFBLE9BQVFBLEtBQUtHLElBQUksRUFDckJDLElBQUksQ0FBQztRQUNWO1FBRUEsT0FBTztJQUNUO0lBRUEsb0JBQW9CO0lBQ3BCLE1BQU1DLGdCQUFnQjtRQUNwQixNQUFNRixPQUFPUixlQUFlcEIsUUFBUXFCLE9BQU87UUFFM0MscUJBQ0UsOERBQUMvQixvREFBYUE7WUFDWmlCLFdBQVdYLDhDQUFFQSxDQUNYLGtEQUNBLDhEQUNBLHdEQUNBLHVDQUNBLG9FQUNBLGtIQUNBO1lBRUZtQyxlQUFlO2dCQUFDcEMsa0RBQVNBO2FBQUM7WUFDMUJxQyxZQUFZO2dCQUNWdEIsTUFBTU47Z0JBQ04sa0JBQWtCO2dCQUNsQjZCLEdBQUc7d0JBQUMsRUFBQzVCLElBQUksRUFBRSxHQUFHSSxPQUFNO3lDQUNsQiw4REFBQ3dCO3dCQUFHLEdBQUd4QixLQUFLO3dCQUFFeUIsUUFBTzt3QkFBU0MsS0FBSTt3QkFBc0I1QixXQUFVOzs7Ozs7O1lBR3RFO3NCQUVDcUI7Ozs7OztJQUdQO0lBRUEscUJBQ0UsOERBQUNRO1FBQUk3QixXQUFXWCw4Q0FBRUEsQ0FDaEIsb0RBQ0FJLFFBQVFxQyxJQUFJLEtBQUssU0FDYixvQ0FDQTs7MEJBR0osOERBQUNEO2dCQUFJN0IsV0FBV1gsOENBQUVBLENBQ2hCLDhFQUNBSSxRQUFRcUMsSUFBSSxLQUFLLFNBQ2IsdUNBQ0E7MEJBRUhyQyxRQUFRcUMsSUFBSSxLQUFLLHVCQUNoQiw4REFBQ3hDLG9GQUFJQTtvQkFBQ1UsV0FBVTs7Ozs7eUNBRWhCLDhEQUFDVCxvRkFBR0E7b0JBQUNTLFdBQVU7Ozs7Ozs7Ozs7OzBCQUtuQiw4REFBQzZCO2dCQUFJN0IsV0FBVTs7a0NBRWIsOERBQUM2Qjt3QkFBSTdCLFdBQVU7OzBDQUNiLDhEQUFDNkI7Z0NBQUk3QixXQUFVOztvQ0FDWlAsUUFBUXFDLElBQUksS0FBSyxTQUFTLE1BQU07b0NBQ2hDckMsUUFBUXNDLEtBQUssSUFBSXRDLFFBQVFxQyxJQUFJLEtBQUssNkJBQ2pDLDhEQUFDRTt3Q0FBS2hDLFdBQVU7a0RBQ2JQLFFBQVFzQyxLQUFLOzs7Ozs7Ozs7Ozs7MENBSXBCLDhEQUFDRjtnQ0FBSTdCLFdBQVU7MENBQ1pQLFFBQVF3QyxTQUFTLGtCQUNoQiw4REFBQ0M7b0NBQUtDLFVBQVUxQyxRQUFRd0MsU0FBUyxDQUFDRyxXQUFXOzhDQUMxQyxJQUFJQyxLQUFLQyxjQUFjLENBQUMsU0FBUzt3Q0FDaENDLE1BQU07d0NBQ05DLFFBQVE7d0NBQ1JDLFFBQVE7b0NBQ1YsR0FBR0MsTUFBTSxDQUFDakQsUUFBUXdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7O2tDQU9uQyw4REFBQ0o7d0JBQUk3QixXQUFVO2tDQUNadUI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtYO0dBdklnQi9COztRQUNZVixpREFBUUE7OztLQURwQlUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9tZXNzYWdlLWNvbnRlbnQudHN4PzQ1MDMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCJcblxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVGhlbWUgfSBmcm9tICduZXh0LXRoZW1lcydcbmltcG9ydCBSZWFjdE1hcmtkb3duIGZyb20gJ3JlYWN0LW1hcmtkb3duJ1xuaW1wb3J0IHsgUHJpc20gYXMgU3ludGF4SGlnaGxpZ2h0ZXIgfSBmcm9tICdyZWFjdC1zeW50YXgtaGlnaGxpZ2h0ZXInXG5pbXBvcnQgeyBvbmVEYXJrLCBvbmVMaWdodCB9IGZyb20gJ3JlYWN0LXN5bnRheC1oaWdobGlnaHRlci9kaXN0L2Nqcy9zdHlsZXMvcHJpc20nXG5pbXBvcnQgcmVtYXJrR2ZtIGZyb20gJ3JlbWFyay1nZm0nXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvbGliL3V0aWxzJ1xuaW1wb3J0IHsgSFRNTEF0dHJpYnV0ZXMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFVzZXIsIEJvdCB9IGZyb20gXCJsdWNpZGUtcmVhY3RcIlxuaW1wb3J0IHsgTWVzc2FnZSwgTWVzc2FnZUNvbnRlbnQgYXMgTWVzc2FnZUNvbnRlbnRUeXBlIH0gZnJvbSAnQC9jb250ZXh0L2NoYXQtY29udGV4dCdcblxuLy8g5Li65LqG6Kej5YazIFN5bnRheEhpZ2hsaWdodGVyIOeahCBzdHlsZSDlsZ7mgKfnsbvlnovpl67pophcbmltcG9ydCB0eXBlIHsgQ1NTUHJvcGVydGllcyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHR5cGUgeyBTeW50YXhIaWdobGlnaHRlclByb3BzIH0gZnJvbSAncmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyJ1xuXG5pbnRlcmZhY2UgQ29kZVByb3BzIGV4dGVuZHMgSFRNTEF0dHJpYnV0ZXM8SFRNTEVsZW1lbnQ+IHtcbiAgbm9kZT86IGFueVxuICBpbmxpbmU/OiBib29sZWFuXG4gIGNsYXNzTmFtZT86IHN0cmluZ1xuICBjaGlsZHJlbj86IFJlYWN0LlJlYWN0Tm9kZVxufVxuXG5pbnRlcmZhY2UgTWVzc2FnZUNvbnRlbnRQcm9wcyB7XG4gIG1lc3NhZ2U6IE1lc3NhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlQ29udGVudCh7IG1lc3NhZ2UgfTogTWVzc2FnZUNvbnRlbnRQcm9wcykge1xuICBjb25zdCB7IHJlc29sdmVkVGhlbWUgfSA9IHVzZVRoZW1lKClcbiAgY29uc3QgW21vdW50ZWQsIHNldE1vdW50ZWRdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRNb3VudGVkKHRydWUpXG4gIH0sIFtdKVxuXG4gIC8vIERvbid0IHNlcnZlci1yZW5kZXIgU3ludGF4SGlnaGxpZ2h0ZXIgdG8gYXZvaWQgaHlkcmF0aW9uIG1pc21hdGNoXG4gIGNvbnN0IGNvZGVDb21wb25lbnQgPSAoeyBub2RlLCBpbmxpbmUsIGNsYXNzTmFtZSwgY2hpbGRyZW4sIC4uLnByb3BzIH06IENvZGVQcm9wcykgPT4ge1xuICAgIC8vIERvbid0IHVzZSBTeW50YXhIaWdobGlnaHRlciB1bnRpbCBjbGllbnQtc2lkZVxuICAgIGlmICghbW91bnRlZCkgcmV0dXJuIDxjb2RlIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSB7Li4ucHJvcHN9PntjaGlsZHJlbn08L2NvZGU+XG4gICAgXG4gICAgY29uc3QgbWF0Y2ggPSAvbGFuZ3VhZ2UtKFxcdyspLy5leGVjKGNsYXNzTmFtZSB8fCAnJylcbiAgICBjb25zdCBsYW5ndWFnZSA9IG1hdGNoID8gbWF0Y2hbMV0gOiAndGV4dCdcbiAgICBcbiAgICByZXR1cm4gIWlubGluZSAmJiBtYXRjaCA/IChcbiAgICAgIDxTeW50YXhIaWdobGlnaHRlclxuICAgICAgICBsYW5ndWFnZT17bGFuZ3VhZ2V9XG4gICAgICAgIFByZVRhZz1cImRpdlwiXG4gICAgICAgIHN0eWxlPXtyZXNvbHZlZFRoZW1lID09PSAnZGFyaycgPyBvbmVEYXJrIDogb25lTGlnaHR9XG4gICAgICAgIHdyYXBMaW5lcz17dHJ1ZX1cbiAgICAgICAgc2hvd0xpbmVOdW1iZXJzPXt0cnVlfVxuICAgICAgICB7Li4ucHJvcHMgYXMgYW55fVxuICAgICAgPlxuICAgICAgICB7U3RyaW5nKGNoaWxkcmVuKS5yZXBsYWNlKC9cXG4kLywgJycpfVxuICAgICAgPC9TeW50YXhIaWdobGlnaHRlcj5cbiAgICApIDogKFxuICAgICAgPGNvZGUgY2xhc3NOYW1lPXtjbGFzc05hbWV9IHsuLi5wcm9wc30+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvY29kZT5cbiAgICApXG4gIH1cblxuICAvLyDlpITnkIbmlrDmtojmga/moLzlvI/vvIzmj5Dlj5bmlofmnKzlhoXlrrlcbiAgY29uc3QgZ2V0TWVzc2FnZVRleHQgPSAoY29udGVudDogTWVzc2FnZUNvbnRlbnRUeXBlW10gfCBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIC8vIOWkhOeQhuaXp+eahOWtl+espuS4suagvOW8j+a2iOaBr++8iOWQkeWQjuWFvOWuue+8iVxuICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBjb250ZW50XG4gICAgfVxuICAgIFxuICAgIC8vIOWkhOeQhuaWsOeahOaVsOe7hOagvOW8j+a2iOaBr1xuICAgIGlmIChBcnJheS5pc0FycmF5KGNvbnRlbnQpKSB7XG4gICAgICByZXR1cm4gY29udGVudFxuICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gaXRlbS50eXBlID09PSAndGV4dCcpXG4gICAgICAgIC5tYXAoaXRlbSA9PiBpdGVtLnRleHQpXG4gICAgICAgIC5qb2luKCdcXG4nKVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIOa4suafk+a2iOaBr+eahCBNYXJrZG93biDlhoXlrrlcbiAgY29uc3QgcmVuZGVyQ29udGVudCA9ICgpID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gZ2V0TWVzc2FnZVRleHQobWVzc2FnZS5jb250ZW50KVxuICAgIFxuICAgIHJldHVybiAoXG4gICAgICA8UmVhY3RNYXJrZG93blxuICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgIFwicHJvc2UgcHJvc2Utc2xhdGUgZGFyazpwcm9zZS1pbnZlcnQgbWF4LXctbm9uZVwiLFxuICAgICAgICAgIFwicHJvc2UtaGVhZGluZ3M6Zm9udC1zZW1pYm9sZCBwcm9zZS1oZWFkaW5nczp0cmFja2luZy10aWdodFwiLFxuICAgICAgICAgIFwicHJvc2UtaDE6dGV4dC14bCBwcm9zZS1oMjp0ZXh0LWxnIHByb3NlLWgzOnRleHQtYmFzZVwiLFxuICAgICAgICAgIFwicHJvc2UtcDpsZWFkaW5nLW5vcm1hbCBwcm9zZS1wOm15LTJcIixcbiAgICAgICAgICBcInByb3NlLXByZTpiZy1zbGF0ZS0xMDAgcHJvc2UtcHJlOmRhcms6Ymctc2xhdGUtOTAwIHByb3NlLXByZTpwLTBcIixcbiAgICAgICAgICBcInByb3NlLWNvZGU6Ymctc2xhdGUtMTAwIHByb3NlLWNvZGU6ZGFyazpiZy1zbGF0ZS04MDAgcHJvc2UtY29kZTpmb250LW1lZGl1bSBwcm9zZS1jb2RlOnJvdW5kZWQgcHJvc2UtY29kZTpweC0xXCIsXG4gICAgICAgICAgXCJicmVhay13b3JkcyBvdmVyZmxvdy1oaWRkZW5cIlxuICAgICAgICApfVxuICAgICAgICByZW1hcmtQbHVnaW5zPXtbcmVtYXJrR2ZtXX1cbiAgICAgICAgY29tcG9uZW50cz17e1xuICAgICAgICAgIGNvZGU6IGNvZGVDb21wb25lbnQsXG4gICAgICAgICAgLy8g6Ieq5a6a5LmJ6ZO+5o6l77yM5re75Yqg55uu5qCH5bGe5oCn5ZKM5qC35byPXG4gICAgICAgICAgYTogKHtub2RlLCAuLi5wcm9wc30pID0+IChcbiAgICAgICAgICAgIDxhIHsuLi5wcm9wc30gdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiIGNsYXNzTmFtZT1cInRleHQtcHJpbWFyeSB1bmRlcmxpbmVcIiAvPlxuICAgICAgICAgICksXG4gICAgICAgICAgLy8g5re75Yqg5pu05aSa57uE5Lu25a6a5Yi2Li4uXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHt0ZXh0fVxuICAgICAgPC9SZWFjdE1hcmtkb3duPlxuICAgIClcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NuKFxuICAgICAgXCJmbGV4IGl0ZW1zLXN0YXJ0IGdhcC00IHAtNCBtYi0zIG14LTIgcm91bmRlZC0yeGxcIixcbiAgICAgIG1lc3NhZ2Uucm9sZSA9PT0gJ3VzZXInIFxuICAgICAgICA/IFwiYmctYmFja2dyb3VuZCBjaGF0LW1lc3NhZ2UtdXNlclwiIFxuICAgICAgICA6IFwiYmctbXV0ZWQvMzAgY2hhdC1tZXNzYWdlLWFzc2lzdGFudFwiXG4gICAgKX0+XG4gICAgICB7Lyog5Y+R6YCB6ICF5aS05YOPICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKFxuICAgICAgICBcImZsZXggaC05IHctOSBzaHJpbmstMCBzZWxlY3Qtbm9uZSBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1mdWxsXCIsXG4gICAgICAgIG1lc3NhZ2Uucm9sZSA9PT0gJ3VzZXInIFxuICAgICAgICAgID8gXCJiZy1wcmltYXJ5IHRleHQtcHJpbWFyeS1mb3JlZ3JvdW5kXCIgXG4gICAgICAgICAgOiBcImJnLW11dGVkIHRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiXG4gICAgICApfT5cbiAgICAgICAge21lc3NhZ2Uucm9sZSA9PT0gJ3VzZXInID8gKFxuICAgICAgICAgIDxVc2VyIGNsYXNzTmFtZT1cImgtNSB3LTVcIiAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxCb3QgY2xhc3NOYW1lPVwiaC01IHctNVwiIC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICAgIFxuICAgICAgey8qIOa2iOaBr+WGheWuuSAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIHNwYWNlLXktMlwiPlxuICAgICAgICB7Lyog5Y+R6YCB6ICF5L+h5oGv5ZKM5pe26Ze05oizICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb250LW1lZGl1bVwiPlxuICAgICAgICAgICAge21lc3NhZ2Uucm9sZSA9PT0gJ3VzZXInID8gJ+S9oCcgOiAnQmVuQ2hhdCd9XG4gICAgICAgICAgICB7bWVzc2FnZS5tb2RlbCAmJiBtZXNzYWdlLnJvbGUgPT09ICdhc3Npc3RhbnQnICYmIChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LXhzIGZvbnQtbm9ybWFsIHRleHQtbXV0ZWQtZm9yZWdyb3VuZFwiPlxuICAgICAgICAgICAgICAgIHttZXNzYWdlLm1vZGVsfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LW11dGVkLWZvcmVncm91bmRcIj5cbiAgICAgICAgICAgIHttZXNzYWdlLmNyZWF0ZWRBdCAmJiAoXG4gICAgICAgICAgICAgIDx0aW1lIGRhdGVUaW1lPXttZXNzYWdlLmNyZWF0ZWRBdC50b0lTT1N0cmluZygpfT5cbiAgICAgICAgICAgICAgICB7bmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ3poLUNOJywgeyBcbiAgICAgICAgICAgICAgICAgIGhvdXI6ICcyLWRpZ2l0JywgXG4gICAgICAgICAgICAgICAgICBtaW51dGU6ICcyLWRpZ2l0JyxcbiAgICAgICAgICAgICAgICAgIGhvdXIxMjogZmFsc2VcbiAgICAgICAgICAgICAgICB9KS5mb3JtYXQobWVzc2FnZS5jcmVhdGVkQXQpfVxuICAgICAgICAgICAgICA8L3RpbWU+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIHsvKiDmtojmga/lhoXlrrkgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvc2UtY29udGFpbmVyXCI+XG4gICAgICAgICAge3JlbmRlckNvbnRlbnQoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlVGhlbWUiLCJSZWFjdE1hcmtkb3duIiwiUHJpc20iLCJTeW50YXhIaWdobGlnaHRlciIsIm9uZURhcmsiLCJvbmVMaWdodCIsInJlbWFya0dmbSIsImNuIiwiVXNlciIsIkJvdCIsIk1lc3NhZ2VDb250ZW50IiwibWVzc2FnZSIsInJlc29sdmVkVGhlbWUiLCJtb3VudGVkIiwic2V0TW91bnRlZCIsImNvZGVDb21wb25lbnQiLCJub2RlIiwiaW5saW5lIiwiY2xhc3NOYW1lIiwiY2hpbGRyZW4iLCJwcm9wcyIsImNvZGUiLCJtYXRjaCIsImV4ZWMiLCJsYW5ndWFnZSIsIlByZVRhZyIsInN0eWxlIiwid3JhcExpbmVzIiwic2hvd0xpbmVOdW1iZXJzIiwiU3RyaW5nIiwicmVwbGFjZSIsImdldE1lc3NhZ2VUZXh0IiwiY29udGVudCIsIkFycmF5IiwiaXNBcnJheSIsImZpbHRlciIsIml0ZW0iLCJ0eXBlIiwibWFwIiwidGV4dCIsImpvaW4iLCJyZW5kZXJDb250ZW50IiwicmVtYXJrUGx1Z2lucyIsImNvbXBvbmVudHMiLCJhIiwidGFyZ2V0IiwicmVsIiwiZGl2Iiwicm9sZSIsIm1vZGVsIiwic3BhbiIsImNyZWF0ZWRBdCIsInRpbWUiLCJkYXRlVGltZSIsInRvSVNPU3RyaW5nIiwiSW50bCIsIkRhdGVUaW1lRm9ybWF0IiwiaG91ciIsIm1pbnV0ZSIsImhvdXIxMiIsImZvcm1hdCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/message-content.tsx\n"));

/***/ })

});