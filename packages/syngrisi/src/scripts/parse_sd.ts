import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

interface StepDefinitionInfo {
  pattern: string;
  jsdoc: string | null;
  examples: string[];
  filePath: string;
  lineNumber: number;
}

function parseStepDefinitions(filePath: string): StepDefinitionInfo[] {
  const results: StepDefinitionInfo[] = [];
  const sourceFile = ts.createSourceFile(
    path.basename(filePath),
    fs.readFileSync(filePath, "utf8"),
    ts.ScriptTarget.Latest,
    true // setParentNodes flag is crucial for finding comments
  );

  function visitNode(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const functionName = node.expression.text;
      if (["When"].includes(functionName)) { // Добавьте 'Given', 'Then' если нужно
        const args = node.arguments;
        if (args.length >= 2) {
          const patternNode = args[0];
          let pattern = "";

          if (ts.isStringLiteral(patternNode)) {
            pattern = patternNode.text;
          } else if (ts.isRegularExpressionLiteral(patternNode)) {
            pattern = patternNode.text;
          }

          if (pattern) {
            let jsdocDescription: string | null = null;
            const examples: string[] = [];

            // Ищем JSDoc для родительского Statement
            let statementNode: ts.Node | undefined = node;
            while (statementNode && !ts.isSourceFile(statementNode)) {
              // isStatement check is important
              if (ts.isStatement(statementNode)) {
                 // Используем getJSDocTags для более прямого доступа к тегам
                 const tags = ts.getJSDocTags(statementNode);

                 // Попробуем получить и основной комментарий (до тегов)
                 const jsDocNodes = (statementNode as any).jsDoc; // Неофициальный, но часто работающий способ получить весь блок
                 if (jsDocNodes && jsDocNodes.length > 0) {
                    const mainComment = jsDocNodes[0].comment;
                     if (mainComment) {
                         jsdocDescription = typeof mainComment === 'string'
                           ? mainComment
                           : ts.displayPartsToString(mainComment);
                         jsdocDescription = jsdocDescription.trim();
                     }
                 }


                 tags.forEach(tag => {
                    // Ищем именно @example тег
                    if (tag.tagName.text.toLowerCase() === 'example') {
                         let exampleText = '';
                         if (tag.comment) {
                             // ts.displayPartsToString лучше обрабатывает сложные структуры (массивы строк и т.д.)
                             exampleText = typeof tag.comment === 'string'
                                 ? tag.comment
                                 : ts.displayPartsToString(tag.comment);

                             // Более аккуратная очистка:
                             // 1. Убираем возможные маркеры начала комментария (`:`) из первой строки
                             // 2. Разделяем на строки
                             // 3. Убираем `*` и пробелы в начале каждой строки
                             // 4. Фильтруем пустые строки
                             // 5. Собираем обратно
                             const cleanedExample = exampleText
                                 .replace(/^:/, '') // Убираем возможное ':' в начале (для @example:)
                                 .split('\n')
                                 .map(line => line.replace(/^\s*\*\s?/, '').trimEnd()) // Убираем * и пробелы слева, только пробелы справа
                                 .filter((line, index, arr) => {
                                      // Убираем пустые строки, но сохраняем первую, если она пустая (после @example)
                                      return line.trim().length > 0 || (index === 0 && arr.length > 1);
                                 })
                                 .map(line => line.trimStart()) // Теперь убираем пробелы слева
                                 .join('\n')
                                 .trim(); // Убираем пустые строки в начале/конце всего блока

                             if (cleanedExample) {
                                 examples.push(cleanedExample);
                             }
                         }
                    }
                 });
                 break; // Нашли JSDoc для statementNode, выходим из while
              }
              statementNode = statementNode.parent;
            }


            const { line } = sourceFile.getLineAndCharacterOfPosition(
              node.getStart()
            );

            results.push({
              pattern,
              jsdoc: jsdocDescription, // Используем извлеченное описание
              examples,
              filePath: path.relative(process.cwd(), filePath),
              lineNumber: line + 1,
            });
          }
        }
      }
    }
    ts.forEachChild(node, visitNode);
  }

  visitNode(sourceFile);
  return results;
}

// --- Пример использования ---
const stepFiles = [
    '/Users/exadel/Projects/web-qa-automation-2/support/step_definitions/base/web/actions.sd.ts' // << ЗАМЕНИТЕ НА ВАШ ПУТЬ
    // Добавьте другие файлы шагов, если нужно
];

let allSteps: StepDefinitionInfo[] = [];
stepFiles.forEach(file => {
    try {
        // Убедитесь, что файл существует
        if (!fs.existsSync(file)) {
             console.warn(`Warning: File not found, skipping: ${file}`);
             return;
        }
        const stepsFromFile = parseStepDefinitions(file);
        allSteps = allSteps.concat(stepsFromFile);
        console.log(`Parsed ${stepsFromFile.length} steps from ${file}`);
    } catch (error) {
        console.error(`Error parsing file ${file}:`, error);
    }
});

// --- Форматирование для промпта ---
console.log("\n--- Available Step Definitions for Prompting ---");

const promptText = allSteps.map(step => {
    let output = `Pattern: ${step.pattern}`;
    // Раскомментируйте, если нужно описание из JSDoc (не @example)
    // if (step.jsdoc) {
    //     output += `\nDescription:\n${step.jsdoc.split('\n').map(l => `  ${l.trim()}`).join('\n')}`;
    // }
    if (step.examples.length > 0) {
        // Форматируем каждый пример отдельно
        output += `\nExamples:\n${step.examples.map(ex =>
            ex.split('\n')
              .map(l => `  - ${l}`) // Добавляем маркер списка
              .join('\n')
        ).join('\n---\n')}`; // Разделяем разные @example блоки (если их несколько у одного шага)
    }
    output += `\n(Source: ${step.filePath}:${step.lineNumber})`
    return output;
}).join('\n\n========================================\n\n'); // Более заметный разделитель шагов

console.log(promptText);

// Можно сохранить в файл
// const outputPath = 'prompt_steps.txt';
// fs.writeFileSync(outputPath, promptText, 'utf8');
// console.log(`\nSaved available steps to ${outputPath}`);