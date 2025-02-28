"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/mdast-util-find-and-replace";
exports.ids = ["vendor-chunks/mdast-util-find-and-replace"];
exports.modules = {

/***/ "(ssr)/./node_modules/mdast-util-find-and-replace/lib/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/mdast-util-find-and-replace/lib/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   findAndReplace: () => (/* binding */ findAndReplace)\n/* harmony export */ });\n/* harmony import */ var escape_string_regexp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! escape-string-regexp */ \"(ssr)/./node_modules/mdast-util-find-and-replace/node_modules/escape-string-regexp/index.js\");\n/* harmony import */ var unist_util_visit_parents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! unist-util-visit-parents */ \"(ssr)/./node_modules/unist-util-visit-parents/lib/index.js\");\n/* harmony import */ var unist_util_is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! unist-util-is */ \"(ssr)/./node_modules/unist-util-is/lib/index.js\");\n/**\n * @import {Nodes, Parents, PhrasingContent, Root, Text} from 'mdast'\n * @import {BuildVisitor, Test, VisitorResult} from 'unist-util-visit-parents'\n */ /**\n * @typedef RegExpMatchObject\n *   Info on the match.\n * @property {number} index\n *   The index of the search at which the result was found.\n * @property {string} input\n *   A copy of the search string in the text node.\n * @property {[...Array<Parents>, Text]} stack\n *   All ancestors of the text node, where the last node is the text itself.\n *\n * @typedef {RegExp | string} Find\n *   Pattern to find.\n *\n *   Strings are escaped and then turned into global expressions.\n *\n * @typedef {Array<FindAndReplaceTuple>} FindAndReplaceList\n *   Several find and replaces, in array form.\n *\n * @typedef {[Find, Replace?]} FindAndReplaceTuple\n *   Find and replace in tuple form.\n *\n * @typedef {ReplaceFunction | string | null | undefined} Replace\n *   Thing to replace with.\n *\n * @callback ReplaceFunction\n *   Callback called when a search matches.\n * @param {...any} parameters\n *   The parameters are the result of corresponding search expression:\n *\n *   * `value` (`string`) — whole match\n *   * `...capture` (`Array<string>`) — matches from regex capture groups\n *   * `match` (`RegExpMatchObject`) — info on the match\n * @returns {Array<PhrasingContent> | PhrasingContent | string | false | null | undefined}\n *   Thing to replace with.\n *\n *   * when `null`, `undefined`, `''`, remove the match\n *   * …or when `false`, do not replace at all\n *   * …or when `string`, replace with a text node of that value\n *   * …or when `Node` or `Array<Node>`, replace with those nodes\n *\n * @typedef {[RegExp, ReplaceFunction]} Pair\n *   Normalized find and replace.\n *\n * @typedef {Array<Pair>} Pairs\n *   All find and replaced.\n *\n * @typedef Options\n *   Configuration.\n * @property {Test | null | undefined} [ignore]\n *   Test for which nodes to ignore (optional).\n */ \n\n\n/**\n * Find patterns in a tree and replace them.\n *\n * The algorithm searches the tree in *preorder* for complete values in `Text`\n * nodes.\n * Partial matches are not supported.\n *\n * @param {Nodes} tree\n *   Tree to change.\n * @param {FindAndReplaceList | FindAndReplaceTuple} list\n *   Patterns to find.\n * @param {Options | null | undefined} [options]\n *   Configuration (when `find` is not `Find`).\n * @returns {undefined}\n *   Nothing.\n */ function findAndReplace(tree, list, options) {\n    const settings = options || {};\n    const ignored = (0,unist_util_is__WEBPACK_IMPORTED_MODULE_1__.convert)(settings.ignore || []);\n    const pairs = toPairs(list);\n    let pairIndex = -1;\n    while(++pairIndex < pairs.length){\n        (0,unist_util_visit_parents__WEBPACK_IMPORTED_MODULE_2__.visitParents)(tree, \"text\", visitor);\n    }\n    /** @type {BuildVisitor<Root, 'text'>} */ function visitor(node, parents) {\n        let index = -1;\n        /** @type {Parents | undefined} */ let grandparent;\n        while(++index < parents.length){\n            const parent = parents[index];\n            /** @type {Array<Nodes> | undefined} */ const siblings = grandparent ? grandparent.children : undefined;\n            if (ignored(parent, siblings ? siblings.indexOf(parent) : undefined, grandparent)) {\n                return;\n            }\n            grandparent = parent;\n        }\n        if (grandparent) {\n            return handler(node, parents);\n        }\n    }\n    /**\n   * Handle a text node which is not in an ignored parent.\n   *\n   * @param {Text} node\n   *   Text node.\n   * @param {Array<Parents>} parents\n   *   Parents.\n   * @returns {VisitorResult}\n   *   Result.\n   */ function handler(node, parents) {\n        const parent = parents[parents.length - 1];\n        const find = pairs[pairIndex][0];\n        const replace = pairs[pairIndex][1];\n        let start = 0;\n        /** @type {Array<Nodes>} */ const siblings = parent.children;\n        const index = siblings.indexOf(node);\n        let change = false;\n        /** @type {Array<PhrasingContent>} */ let nodes = [];\n        find.lastIndex = 0;\n        let match = find.exec(node.value);\n        while(match){\n            const position = match.index;\n            /** @type {RegExpMatchObject} */ const matchObject = {\n                index: match.index,\n                input: match.input,\n                stack: [\n                    ...parents,\n                    node\n                ]\n            };\n            let value = replace(...match, matchObject);\n            if (typeof value === \"string\") {\n                value = value.length > 0 ? {\n                    type: \"text\",\n                    value\n                } : undefined;\n            }\n            // It wasn’t a match after all.\n            if (value === false) {\n                // False acts as if there was no match.\n                // So we need to reset `lastIndex`, which currently being at the end of\n                // the current match, to the beginning.\n                find.lastIndex = position + 1;\n            } else {\n                if (start !== position) {\n                    nodes.push({\n                        type: \"text\",\n                        value: node.value.slice(start, position)\n                    });\n                }\n                if (Array.isArray(value)) {\n                    nodes.push(...value);\n                } else if (value) {\n                    nodes.push(value);\n                }\n                start = position + match[0].length;\n                change = true;\n            }\n            if (!find.global) {\n                break;\n            }\n            match = find.exec(node.value);\n        }\n        if (change) {\n            if (start < node.value.length) {\n                nodes.push({\n                    type: \"text\",\n                    value: node.value.slice(start)\n                });\n            }\n            parent.children.splice(index, 1, ...nodes);\n        } else {\n            nodes = [\n                node\n            ];\n        }\n        return index + nodes.length;\n    }\n}\n/**\n * Turn a tuple or a list of tuples into pairs.\n *\n * @param {FindAndReplaceList | FindAndReplaceTuple} tupleOrList\n *   Schema.\n * @returns {Pairs}\n *   Clean pairs.\n */ function toPairs(tupleOrList) {\n    /** @type {Pairs} */ const result = [];\n    if (!Array.isArray(tupleOrList)) {\n        throw new TypeError(\"Expected find and replace tuple or list of tuples\");\n    }\n    /** @type {FindAndReplaceList} */ // @ts-expect-error: correct.\n    const list = !tupleOrList[0] || Array.isArray(tupleOrList[0]) ? tupleOrList : [\n        tupleOrList\n    ];\n    let index = -1;\n    while(++index < list.length){\n        const tuple = list[index];\n        result.push([\n            toExpression(tuple[0]),\n            toFunction(tuple[1])\n        ]);\n    }\n    return result;\n}\n/**\n * Turn a find into an expression.\n *\n * @param {Find} find\n *   Find.\n * @returns {RegExp}\n *   Expression.\n */ function toExpression(find) {\n    return typeof find === \"string\" ? new RegExp((0,escape_string_regexp__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(find), \"g\") : find;\n}\n/**\n * Turn a replace into a function.\n *\n * @param {Replace} replace\n *   Replace.\n * @returns {ReplaceFunction}\n *   Function.\n */ function toFunction(replace) {\n    return typeof replace === \"function\" ? replace : function() {\n        return replace;\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWRhc3QtdXRpbC1maW5kLWFuZC1yZXBsYWNlL2xpYi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7OztDQUdDLEdBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBa0RDLEdBRXdDO0FBQ1k7QUFDaEI7QUFFckM7Ozs7Ozs7Ozs7Ozs7OztDQWVDLEdBQ00sU0FBU0csZUFBZUMsSUFBSSxFQUFFQyxJQUFJLEVBQUVDLE9BQU87SUFDaEQsTUFBTUMsV0FBV0QsV0FBVyxDQUFDO0lBQzdCLE1BQU1FLFVBQVVOLHNEQUFPQSxDQUFDSyxTQUFTRSxNQUFNLElBQUksRUFBRTtJQUM3QyxNQUFNQyxRQUFRQyxRQUFRTjtJQUN0QixJQUFJTyxZQUFZLENBQUM7SUFFakIsTUFBTyxFQUFFQSxZQUFZRixNQUFNRyxNQUFNLENBQUU7UUFDakNaLHNFQUFZQSxDQUFDRyxNQUFNLFFBQVFVO0lBQzdCO0lBRUEsdUNBQXVDLEdBQ3ZDLFNBQVNBLFFBQVFDLElBQUksRUFBRUMsT0FBTztRQUM1QixJQUFJQyxRQUFRLENBQUM7UUFDYixnQ0FBZ0MsR0FDaEMsSUFBSUM7UUFFSixNQUFPLEVBQUVELFFBQVFELFFBQVFILE1BQU0sQ0FBRTtZQUMvQixNQUFNTSxTQUFTSCxPQUFPLENBQUNDLE1BQU07WUFDN0IscUNBQXFDLEdBQ3JDLE1BQU1HLFdBQVdGLGNBQWNBLFlBQVlHLFFBQVEsR0FBR0M7WUFFdEQsSUFDRWQsUUFDRVcsUUFDQUMsV0FBV0EsU0FBU0csT0FBTyxDQUFDSixVQUFVRyxXQUN0Q0osY0FFRjtnQkFDQTtZQUNGO1lBRUFBLGNBQWNDO1FBQ2hCO1FBRUEsSUFBSUQsYUFBYTtZQUNmLE9BQU9NLFFBQVFULE1BQU1DO1FBQ3ZCO0lBQ0Y7SUFFQTs7Ozs7Ozs7O0dBU0MsR0FDRCxTQUFTUSxRQUFRVCxJQUFJLEVBQUVDLE9BQU87UUFDNUIsTUFBTUcsU0FBU0gsT0FBTyxD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Q0FBQztZQUFDVSxhQUFhRCxLQUFLLENBQUMsRUFBRTtZQUFHRSxXQUFXRixLQUFLLENBQUMsRUFBRTtTQUFFO0lBQzVEO0lBRUEsT0FBT0Y7QUFDVDtBQUVBOzs7Ozs7O0NBT0MsR0FDRCxTQUFTRyxhQUFheEIsSUFBSTtJQUN4QixPQUFPLE9BQU9BLFNBQVMsV0FBVyxJQUFJMEIsT0FBT25ELGdFQUFNQSxDQUFDeUIsT0FBTyxPQUFPQTtBQUNwRTtBQUVBOzs7Ozs7O0NBT0MsR0FDRCxTQUFTeUIsV0FBV3hCLE9BQU87SUFDekIsT0FBTyxPQUFPQSxZQUFZLGFBQ3RCQSxVQUNBO1FBQ0UsT0FBT0E7SUFDVDtBQUNOIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmVuY2hhdC8uL25vZGVfbW9kdWxlcy9tZGFzdC11dGlsLWZpbmQtYW5kLXJlcGxhY2UvbGliL2luZGV4LmpzPzk0MjMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAaW1wb3J0IHtOb2RlcywgUGFyZW50cywgUGhyYXNpbmdDb250ZW50LCBSb290LCBUZXh0fSBmcm9tICdtZGFzdCdcbiAqIEBpbXBvcnQge0J1aWxkVmlzaXRvciwgVGVzdCwgVmlzaXRvclJlc3VsdH0gZnJvbSAndW5pc3QtdXRpbC12aXNpdC1wYXJlbnRzJ1xuICovXG5cbi8qKlxuICogQHR5cGVkZWYgUmVnRXhwTWF0Y2hPYmplY3RcbiAqICAgSW5mbyBvbiB0aGUgbWF0Y2guXG4gKiBAcHJvcGVydHkge251bWJlcn0gaW5kZXhcbiAqICAgVGhlIGluZGV4IG9mIHRoZSBzZWFyY2ggYXQgd2hpY2ggdGhlIHJlc3VsdCB3YXMgZm91bmQuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaW5wdXRcbiAqICAgQSBjb3B5IG9mIHRoZSBzZWFyY2ggc3RyaW5nIGluIHRoZSB0ZXh0IG5vZGUuXG4gKiBAcHJvcGVydHkge1suLi5BcnJheTxQYXJlbnRzPiwgVGV4dF19IHN0YWNrXG4gKiAgIEFsbCBhbmNlc3RvcnMgb2YgdGhlIHRleHQgbm9kZSwgd2hlcmUgdGhlIGxhc3Qgbm9kZSBpcyB0aGUgdGV4dCBpdHNlbGYuXG4gKlxuICogQHR5cGVkZWYge1JlZ0V4cCB8IHN0cmluZ30gRmluZFxuICogICBQYXR0ZXJuIHRvIGZpbmQuXG4gKlxuICogICBTdHJpbmdzIGFyZSBlc2NhcGVkIGFuZCB0aGVuIHR1cm5lZCBpbnRvIGdsb2JhbCBleHByZXNzaW9ucy5cbiAqXG4gKiBAdHlwZWRlZiB7QXJyYXk8RmluZEFuZFJlcGxhY2VUdXBsZT59IEZpbmRBbmRSZXBsYWNlTGlzdFxuICogICBTZXZlcmFsIGZpbmQgYW5kIHJlcGxhY2VzLCBpbiBhcnJheSBmb3JtLlxuICpcbiAqIEB0eXBlZGVmIHtbRmluZCwgUmVwbGFjZT9dfSBGaW5kQW5kUmVwbGFjZVR1cGxlXG4gKiAgIEZpbmQgYW5kIHJlcGxhY2UgaW4gdHVwbGUgZm9ybS5cbiAqXG4gKiBAdHlwZWRlZiB7UmVwbGFjZUZ1bmN0aW9uIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZH0gUmVwbGFjZVxuICogICBUaGluZyB0byByZXBsYWNlIHdpdGguXG4gKlxuICogQGNhbGxiYWNrIFJlcGxhY2VGdW5jdGlvblxuICogICBDYWxsYmFjayBjYWxsZWQgd2hlbiBhIHNlYXJjaCBtYXRjaGVzLlxuICogQHBhcmFtIHsuLi5hbnl9IHBhcmFtZXRlcnNcbiAqICAgVGhlIHBhcmFtZXRlcnMgYXJlIHRoZSByZXN1bHQgb2YgY29ycmVzcG9uZGluZyBzZWFyY2ggZXhwcmVzc2lvbjpcbiAqXG4gKiAgICogYHZhbHVlYCAoYHN0cmluZ2ApIOKAlCB3aG9sZSBtYXRjaFxuICogICAqIGAuLi5jYXB0dXJlYCAoYEFycmF5PHN0cmluZz5gKSDigJQgbWF0Y2hlcyBmcm9tIHJlZ2V4IGNhcHR1cmUgZ3JvdXBzXG4gKiAgICogYG1hdGNoYCAoYFJlZ0V4cE1hdGNoT2JqZWN0YCkg4oCUIGluZm8gb24gdGhlIG1hdGNoXG4gKiBAcmV0dXJucyB7QXJyYXk8UGhyYXNpbmdDb250ZW50PiB8IFBocmFzaW5nQ29udGVudCB8IHN0cmluZyB8IGZhbHNlIHwgbnVsbCB8IHVuZGVmaW5lZH1cbiAqICAgVGhpbmcgdG8gcmVwbGFjZSB3aXRoLlxuICpcbiAqICAgKiB3aGVuIGBudWxsYCwgYHVuZGVmaW5lZGAsIGAnJ2AsIHJlbW92ZSB0aGUgbWF0Y2hcbiAqICAgKiDigKZvciB3aGVuIGBmYWxzZWAsIGRvIG5vdCByZXBsYWNlIGF0IGFsbFxuICogICAqIOKApm9yIHdoZW4gYHN0cmluZ2AsIHJlcGxhY2Ugd2l0aCBhIHRleHQgbm9kZSBvZiB0aGF0IHZhbHVlXG4gKiAgICog4oCmb3Igd2hlbiBgTm9kZWAgb3IgYEFycmF5PE5vZGU+YCwgcmVwbGFjZSB3aXRoIHRob3NlIG5vZGVzXG4gKlxuICogQHR5cGVkZWYge1tSZWdFeHAsIFJlcGxhY2VGdW5jdGlvbl19IFBhaXJcbiAqICAgTm9ybWFsaXplZCBmaW5kIGFuZCByZXBsYWNlLlxuICpcbiAqIEB0eXBlZGVmIHtBcnJheTxQYWlyPn0gUGFpcnNcbiAqICAgQWxsIGZpbmQgYW5kIHJlcGxhY2VkLlxuICpcbiAqIEB0eXBlZGVmIE9wdGlvbnNcbiAqICAgQ29uZmlndXJhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7VGVzdCB8IG51bGwgfCB1bmRlZmluZWR9IFtpZ25vcmVdXG4gKiAgIFRlc3QgZm9yIHdoaWNoIG5vZGVzIHRvIGlnbm9yZSAob3B0aW9uYWwpLlxuICovXG5cbmltcG9ydCBlc2NhcGUgZnJvbSAnZXNjYXBlLXN0cmluZy1yZWdleHAnXG5pbXBvcnQge3Zpc2l0UGFyZW50c30gZnJvbSAndW5pc3QtdXRpbC12aXNpdC1wYXJlbnRzJ1xuaW1wb3J0IHtjb252ZXJ0fSBmcm9tICd1bmlzdC11dGlsLWlzJ1xuXG4vKipcbiAqIEZpbmQgcGF0dGVybnMgaW4gYSB0cmVlIGFuZCByZXBsYWNlIHRoZW0uXG4gKlxuICogVGhlIGFsZ29yaXRobSBzZWFyY2hlcyB0aGUgdHJlZSBpbiAqcHJlb3JkZXIqIGZvciBjb21wbGV0ZSB2YWx1ZXMgaW4gYFRleHRgXG4gKiBub2Rlcy5cbiAqIFBhcnRpYWwgbWF0Y2hlcyBhcmUgbm90IHN1cHBvcnRlZC5cbiAqXG4gKiBAcGFyYW0ge05vZGVzfSB0cmVlXG4gKiAgIFRyZWUgdG8gY2hhbmdlLlxuICogQHBhcmFtIHtGaW5kQW5kUmVwbGFjZUxpc3QgfCBGaW5kQW5kUmVwbGFjZVR1cGxlfSBsaXN0XG4gKiAgIFBhdHRlcm5zIHRvIGZpbmQuXG4gKiBAcGFyYW0ge09wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkfSBbb3B0aW9uc11cbiAqICAgQ29uZmlndXJhdGlvbiAod2hlbiBgZmluZGAgaXMgbm90IGBGaW5kYCkuXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICogICBOb3RoaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZEFuZFJlcGxhY2UodHJlZSwgbGlzdCwgb3B0aW9ucykge1xuICBjb25zdCBzZXR0aW5ncyA9IG9wdGlvbnMgfHwge31cbiAgY29uc3QgaWdub3JlZCA9IGNvbnZlcnQoc2V0dGluZ3MuaWdub3JlIHx8IFtdKVxuICBjb25zdCBwYWlycyA9IHRvUGFpcnMobGlzdClcbiAgbGV0IHBhaXJJbmRleCA9IC0xXG5cbiAgd2hpbGUgKCsrcGFpckluZGV4IDwgcGFpcnMubGVuZ3RoKSB7XG4gICAgdmlzaXRQYXJlbnRzKHRyZWUsICd0ZXh0JywgdmlzaXRvcilcbiAgfVxuXG4gIC8qKiBAdHlwZSB7QnVpbGRWaXNpdG9yPFJvb3QsICd0ZXh0Jz59ICovXG4gIGZ1bmN0aW9uIHZpc2l0b3Iobm9kZSwgcGFyZW50cykge1xuICAgIGxldCBpbmRleCA9IC0xXG4gICAgLyoqIEB0eXBlIHtQYXJlbnRzIHwgdW5kZWZpbmVkfSAqL1xuICAgIGxldCBncmFuZHBhcmVudFxuXG4gICAgd2hpbGUgKCsraW5kZXggPCBwYXJlbnRzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFyZW50ID0gcGFyZW50c1tpbmRleF1cbiAgICAgIC8qKiBAdHlwZSB7QXJyYXk8Tm9kZXM+IHwgdW5kZWZpbmVkfSAqL1xuICAgICAgY29uc3Qgc2libGluZ3MgPSBncmFuZHBhcmVudCA/IGdyYW5kcGFyZW50LmNoaWxkcmVuIDogdW5kZWZpbmVkXG5cbiAgICAgIGlmIChcbiAgICAgICAgaWdub3JlZChcbiAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgc2libGluZ3MgPyBzaWJsaW5ncy5pbmRleE9mKHBhcmVudCkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgZ3JhbmRwYXJlbnRcbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBncmFuZHBhcmVudCA9IHBhcmVudFxuICAgIH1cblxuICAgIGlmIChncmFuZHBhcmVudCkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIobm9kZSwgcGFyZW50cylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIGEgdGV4dCBub2RlIHdoaWNoIGlzIG5vdCBpbiBhbiBpZ25vcmVkIHBhcmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtUZXh0fSBub2RlXG4gICAqICAgVGV4dCBub2RlLlxuICAgKiBAcGFyYW0ge0FycmF5PFBhcmVudHM+fSBwYXJlbnRzXG4gICAqICAgUGFyZW50cy5cbiAgICogQHJldHVybnMge1Zpc2l0b3JSZXN1bHR9XG4gICAqICAgUmVzdWx0LlxuICAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlcihub2RlLCBwYXJlbnRzKSB7XG4gICAgY29uc3QgcGFyZW50ID0gcGFyZW50c1twYXJlbnRzLmxlbmd0aCAtIDFdXG4gICAgY29uc3QgZmluZCA9IHBhaXJzW3BhaXJJbmRleF1bMF1cbiAgICBjb25zdCByZXBsYWNlID0gcGFpcnNbcGFpckluZGV4XVsxXVxuICAgIGxldCBzdGFydCA9IDBcbiAgICAvKiogQHR5cGUge0FycmF5PE5vZGVzPn0gKi9cbiAgICBjb25zdCBzaWJsaW5ncyA9IHBhcmVudC5jaGlsZHJlblxuICAgIGNvbnN0IGluZGV4ID0gc2libGluZ3MuaW5kZXhPZihub2RlKVxuICAgIGxldCBjaGFuZ2UgPSBmYWxzZVxuICAgIC8qKiBAdHlwZSB7QXJyYXk8UGhyYXNpbmdDb250ZW50Pn0gKi9cbiAgICBsZXQgbm9kZXMgPSBbXVxuXG4gICAgZmluZC5sYXN0SW5kZXggPSAwXG5cbiAgICBsZXQgbWF0Y2ggPSBmaW5kLmV4ZWMobm9kZS52YWx1ZSlcblxuICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSBtYXRjaC5pbmRleFxuICAgICAgLyoqIEB0eXBlIHtSZWdFeHBNYXRjaE9iamVjdH0gKi9cbiAgICAgIGNvbnN0IG1hdGNoT2JqZWN0ID0ge1xuICAgICAgICBpbmRleDogbWF0Y2guaW5kZXgsXG4gICAgICAgIGlucHV0OiBtYXRjaC5pbnB1dCxcbiAgICAgICAgc3RhY2s6IFsuLi5wYXJlbnRzLCBub2RlXVxuICAgICAgfVxuICAgICAgbGV0IHZhbHVlID0gcmVwbGFjZSguLi5tYXRjaCwgbWF0Y2hPYmplY3QpXG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUubGVuZ3RoID4gMCA/IHt0eXBlOiAndGV4dCcsIHZhbHVlfSA6IHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICAvLyBJdCB3YXNu4oCZdCBhIG1hdGNoIGFmdGVyIGFsbC5cbiAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgLy8gRmFsc2UgYWN0cyBhcyBpZiB0aGVyZSB3YXMgbm8gbWF0Y2guXG4gICAgICAgIC8vIFNvIHdlIG5lZWQgdG8gcmVzZXQgYGxhc3RJbmRleGAsIHdoaWNoIGN1cnJlbnRseSBiZWluZyBhdCB0aGUgZW5kIG9mXG4gICAgICAgIC8vIHRoZSBjdXJyZW50IG1hdGNoLCB0byB0aGUgYmVnaW5uaW5nLlxuICAgICAgICBmaW5kLmxhc3RJbmRleCA9IHBvc2l0aW9uICsgMVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHN0YXJ0ICE9PSBwb3NpdGlvbikge1xuICAgICAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgdmFsdWU6IG5vZGUudmFsdWUuc2xpY2Uoc3RhcnQsIHBvc2l0aW9uKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICBub2Rlcy5wdXNoKC4uLnZhbHVlKVxuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgbm9kZXMucHVzaCh2YWx1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0ID0gcG9zaXRpb24gKyBtYXRjaFswXS5sZW5ndGhcbiAgICAgICAgY2hhbmdlID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZpbmQuZ2xvYmFsKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIG1hdGNoID0gZmluZC5leGVjKG5vZGUudmFsdWUpXG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZSkge1xuICAgICAgaWYgKHN0YXJ0IDwgbm9kZS52YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgbm9kZXMucHVzaCh7dHlwZTogJ3RleHQnLCB2YWx1ZTogbm9kZS52YWx1ZS5zbGljZShzdGFydCl9KVxuICAgICAgfVxuXG4gICAgICBwYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxLCAuLi5ub2RlcylcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZXMgPSBbbm9kZV1cbiAgICB9XG5cbiAgICByZXR1cm4gaW5kZXggKyBub2Rlcy5sZW5ndGhcbiAgfVxufVxuXG4vKipcbiAqIFR1cm4gYSB0dXBsZSBvciBhIGxpc3Qgb2YgdHVwbGVzIGludG8gcGFpcnMuXG4gKlxuICogQHBhcmFtIHtGaW5kQW5kUmVwbGFjZUxpc3QgfCBGaW5kQW5kUmVwbGFjZVR1cGxlfSB0dXBsZU9yTGlzdFxuICogICBTY2hlbWEuXG4gKiBAcmV0dXJucyB7UGFpcnN9XG4gKiAgIENsZWFuIHBhaXJzLlxuICovXG5mdW5jdGlvbiB0b1BhaXJzKHR1cGxlT3JMaXN0KSB7XG4gIC8qKiBAdHlwZSB7UGFpcnN9ICovXG4gIGNvbnN0IHJlc3VsdCA9IFtdXG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KHR1cGxlT3JMaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGZpbmQgYW5kIHJlcGxhY2UgdHVwbGUgb3IgbGlzdCBvZiB0dXBsZXMnKVxuICB9XG5cbiAgLyoqIEB0eXBlIHtGaW5kQW5kUmVwbGFjZUxpc3R9ICovXG4gIC8vIEB0cy1leHBlY3QtZXJyb3I6IGNvcnJlY3QuXG4gIGNvbnN0IGxpc3QgPVxuICAgICF0dXBsZU9yTGlzdFswXSB8fCBBcnJheS5pc0FycmF5KHR1cGxlT3JMaXN0WzBdKVxuICAgICAgPyB0dXBsZU9yTGlzdFxuICAgICAgOiBbdHVwbGVPckxpc3RdXG5cbiAgbGV0IGluZGV4ID0gLTFcblxuICB3aGlsZSAoKytpbmRleCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgY29uc3QgdHVwbGUgPSBsaXN0W2luZGV4XVxuICAgIHJlc3VsdC5wdXNoKFt0b0V4cHJlc3Npb24odHVwbGVbMF0pLCB0b0Z1bmN0aW9uKHR1cGxlWzFdKV0pXG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG5cbi8qKlxuICogVHVybiBhIGZpbmQgaW50byBhbiBleHByZXNzaW9uLlxuICpcbiAqIEBwYXJhbSB7RmluZH0gZmluZFxuICogICBGaW5kLlxuICogQHJldHVybnMge1JlZ0V4cH1cbiAqICAgRXhwcmVzc2lvbi5cbiAqL1xuZnVuY3Rpb24gdG9FeHByZXNzaW9uKGZpbmQpIHtcbiAgcmV0dXJuIHR5cGVvZiBmaW5kID09PSAnc3RyaW5nJyA/IG5ldyBSZWdFeHAoZXNjYXBlKGZpbmQpLCAnZycpIDogZmluZFxufVxuXG4vKipcbiAqIFR1cm4gYSByZXBsYWNlIGludG8gYSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1JlcGxhY2V9IHJlcGxhY2VcbiAqICAgUmVwbGFjZS5cbiAqIEByZXR1cm5zIHtSZXBsYWNlRnVuY3Rpb259XG4gKiAgIEZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiB0b0Z1bmN0aW9uKHJlcGxhY2UpIHtcbiAgcmV0dXJuIHR5cGVvZiByZXBsYWNlID09PSAnZnVuY3Rpb24nXG4gICAgPyByZXBsYWNlXG4gICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiByZXBsYWNlXG4gICAgICB9XG59XG4iXSwibmFtZXMiOlsiZXNjYXBlIiwidmlzaXRQYXJlbnRzIiwiY29udmVydCIsImZpbmRBbmRSZXBsYWNlIiwidHJlZSIsImxpc3QiLCJvcHRpb25zIiwic2V0dGluZ3MiLCJpZ25vcmVkIiwiaWdub3JlIiwicGFpcnMiLCJ0b1BhaXJzIiwicGFpckluZGV4IiwibGVuZ3RoIiwidmlzaXRvciIsIm5vZGUiLCJwYXJlbnRzIiwiaW5kZXgiLCJncmFuZHBhcmVudCIsInBhcmVudCIsInNpYmxpbmdzIiwiY2hpbGRyZW4iLCJ1bmRlZmluZWQiLCJpbmRleE9mIiwiaGFuZGxlciIsImZpbmQiLCJyZXBsYWNlIiwic3RhcnQiLCJjaGFuZ2UiLCJub2RlcyIsImxhc3RJbmRleCIsIm1hdGNoIiwiZXhlYyIsInZhbHVlIiwicG9zaXRpb24iLCJtYXRjaE9iamVjdCIsImlucHV0Iiwic3RhY2siLCJ0eXBlIiwicHVzaCIsInNsaWNlIiwiQXJyYXkiLCJpc0FycmF5IiwiZ2xvYmFsIiwic3BsaWNlIiwidHVwbGVPckxpc3QiLCJyZXN1bHQiLCJUeXBlRXJyb3IiLCJ0dXBsZSIsInRvRXhwcmVzc2lvbiIsInRvRnVuY3Rpb24iLCJSZWdFeHAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/mdast-util-find-and-replace/lib/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/mdast-util-find-and-replace/node_modules/escape-string-regexp/index.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/mdast-util-find-and-replace/node_modules/escape-string-regexp/index.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ escapeStringRegexp)\n/* harmony export */ });\nfunction escapeStringRegexp(string) {\n    if (typeof string !== \"string\") {\n        throw new TypeError(\"Expected a string\");\n    }\n    // Escape characters with special meaning either inside or outside character sets.\n    // Use a simple backslash escape when it’s always valid, and a `\\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.\n    return string.replace(/[|\\\\{}()[\\]^$+*?.]/g, \"\\\\$&\").replace(/-/g, \"\\\\x2d\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWRhc3QtdXRpbC1maW5kLWFuZC1yZXBsYWNlL25vZGVfbW9kdWxlcy9lc2NhcGUtc3RyaW5nLXJlZ2V4cC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQWUsU0FBU0EsbUJBQW1CQyxNQUFNO0lBQ2hELElBQUksT0FBT0EsV0FBVyxVQUFVO1FBQy9CLE1BQU0sSUFBSUMsVUFBVTtJQUNyQjtJQUVBLGtGQUFrRjtJQUNsRiw2SkFBNko7SUFDN0osT0FBT0QsT0FDTEUsT0FBTyxDQUFDLHVCQUF1QixRQUMvQkEsT0FBTyxDQUFDLE1BQU07QUFDakIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iZW5jaGF0Ly4vbm9kZV9tb2R1bGVzL21kYXN0LXV0aWwtZmluZC1hbmQtcmVwbGFjZS9ub2RlX21vZHVsZXMvZXNjYXBlLXN0cmluZy1yZWdleHAvaW5kZXguanM/MmUyOSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlc2NhcGVTdHJpbmdSZWdleHAoc3RyaW5nKSB7XG5cdGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgc3RyaW5nJyk7XG5cdH1cblxuXHQvLyBFc2NhcGUgY2hhcmFjdGVycyB3aXRoIHNwZWNpYWwgbWVhbmluZyBlaXRoZXIgaW5zaWRlIG9yIG91dHNpZGUgY2hhcmFjdGVyIHNldHMuXG5cdC8vIFVzZSBhIHNpbXBsZSBiYWNrc2xhc2ggZXNjYXBlIHdoZW4gaXTigJlzIGFsd2F5cyB2YWxpZCwgYW5kIGEgYFxceG5uYCBlc2NhcGUgd2hlbiB0aGUgc2ltcGxlciBmb3JtIHdvdWxkIGJlIGRpc2FsbG93ZWQgYnkgVW5pY29kZSBwYXR0ZXJuc+KAmSBzdHJpY3RlciBncmFtbWFyLlxuXHRyZXR1cm4gc3RyaW5nXG5cdFx0LnJlcGxhY2UoL1t8XFxcXHt9KClbXFxdXiQrKj8uXS9nLCAnXFxcXCQmJylcblx0XHQucmVwbGFjZSgvLS9nLCAnXFxcXHgyZCcpO1xufVxuIl0sIm5hbWVzIjpbImVzY2FwZVN0cmluZ1JlZ2V4cCIsInN0cmluZyIsIlR5cGVFcnJvciIsInJlcGxhY2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/mdast-util-find-and-replace/node_modules/escape-string-regexp/index.js\n");

/***/ })

};
;