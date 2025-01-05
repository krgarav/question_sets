import ExcelJS from "exceljs";
import fs, { existsSync } from "fs";
import path from "path";
import XLSX from "xlsx";
import { XMLParser } from "fast-xml-parser";
import { Parser } from "htmlparser2";

import xml2js from "xml2js";
import { convertHtmlToText } from "../services/helperFn.js";

// Outputs: 3.75 cm²

// function convertToSuperscriptAndSubscript(text) {
//   const superscriptMap = {
//     0: "⁰",
//     1: "¹",
//     2: "²",
//     3: "³",
//     4: "⁴",
//     5: "⁵",
//     6: "⁶",
//     7: "⁷",
//     8: "⁸",
//     9: "⁹",
//     "+": "⁺",
//     "-": "⁻",
//     "=": "⁼",
//     "(": "⁽",
//     ")": "⁾",
//   };

//   const subscriptMap = {
//     0: "₀",
//     1: "₁",
//     2: "₂",
//     3: "₃",
//     4: "₄",
//     5: "₅",
//     6: "₆",
//     7: "₇",
//     8: "₈",
//     9: "₉",
//     "+": "₊",
//     "-": "₋",
//     "=": "₌",
//     "(": "₍",
//     ")": "₎",
//   };

//   // Replace numbers in superscript
//   text = text.replace(/<sup>(\d+)<\/sup>/g, (match, number) => {
//     return number
//       .split("")
//       .map((digit) => superscriptMap[digit] || digit)
//       .join("");
//   });

//   // Replace numbers in subscript
//   text = text.replace(/<sub>(\d+)<\/sub>/g, (match, number) => {
//     return number
//       .split("")
//       .map((digit) => subscriptMap[digit] || digit)
//       .join("");
//   });
//   console.log(text);
//   return htmlToText(text);
// }
// function convertHtmlToText() {
//   const html =
//     '<span style="font-size:12pt;">3.75 cm</span><span style="font-size:12pt;"><sup>2</sup></span>';

//   let text = convertToSuperscriptAndSubscript(html);
//   console.log(text);
// }
// convertHtmlToText();
// export const genrateQuestionSetsController = async (req, res) => {
//     try {
//         let filePaths = req.files.map(file => file.path);

//         const { name } = req.body;
//         const parentFolder = 'results';
//         const newFolder = name;
//         const newFolderPath = path.join(parentFolder, newFolder);
//         fs.mkdirSync(newFolderPath);
//         let fileReadPromises = filePaths.map(async (path) => {
//             const workbook = new ExcelJS.Workbook();
//             await workbook.xlsx.readFile(path);
//             const worksheet = workbook.getWorksheet();
//             if (!worksheet) {
//                 throw new Error('Worksheet not found in the Excel file.');
//             }

//             let data = [];
//             const heading = [];

//             worksheet.eachRow((row, rowNumber) => {
//                 const rowData = {};
//                 row.eachCell((cell, colNumber) => {
//                     if (rowNumber == 99) {

//                         // console.log("value ---> ", cell.value.richText);
//                     }
//                     if (rowNumber == 1) {
//                         heading[colNumber - 1] = cell.value;
//                     } else {
//                         if (cell.value.richText && cell.value.richText.length > 0) {
//                             // Handle rich text formatting
//                             console.log(cell.value.richText);
//                             const formattedText = cell.value.richText.map((textObject) => {
//                                 const vertAlign = textObject.font && textObject.font.vertAlign;
//                                 const text = textObject.text;

//                                 // Process the text based on vertAlign value
//                                 // (You can customize this part based on your requirements)
//                                 const formattedText = vertAlign === 'superscript' ? superscriptMapping[text] : text;

//                                 return formattedText;
//                                 // return textObject.text;
//                             }).join('');
//                             rowData[`column${colNumber}`] = formattedText;
//                         } else {
//                             rowData[`column${colNumber}`] = cell.value;
//                         }
//                         // rowData[`column${colNumber}`] = cell.value;
//                     }
//                 });
//                 if (rowNumber !== 1) {
//                     data.push(rowData);
//                 }
//             });

//             data.shift();
//             return data;
//         });

//         let filesData = await Promise.all(fileReadPromises);
//         let data = filesData[0];
//         let inputFileWithAnswer = "";
//         let inputFileWithOutAnswer = "";
//         for (let i = 0; i < data.length; i++) {
//             let a = data[i];
//             let b = "";
//             b += (i + 1) + ".";
//             b += "   " + a.column2 + "\n";
//             b += "     " + "(a) " + a.column3 + "\n";
//             b += "     " + "(b) " + a.column4 + "\n";
//             b += "     " + "(c) " + a.column5 + "\n";
//             b += "     " + "(d) " + a.column6 + "\n";
//             inputFileWithOutAnswer += b + "\n";
//             b += "     " + "(ans) " + a.column7 + "\n";
//             inputFileWithAnswer += b + "\n";
//         }

//         const oq = 'results/' + name + '/Orignal_set' + '.txt';
//         const qwa = 'results/' + name + '/Orignal_Set_WithAnswer' + '.txt';

//         fs.writeFileSync(qwa, inputFileWithAnswer);
//         fs.writeFileSync(oq, inputFileWithOutAnswer);
//         let questionSetsData = [];
//         for (let i = 0; i < 4; i++) {
//             console.log("fust")

//             let a = [];
//             let len1 = filesData[0].length;
//             // let len2 = filesData[1].length;
//             for (let j = 0; j < len1; j++) {
//                 let index = (j + 25 + ((i + 1) * 10)) % len1
//                 let b = filesData[0][index];

//                 a.push(b);

//             }

//             let mergedData = a;
//             let questionsWithAnswer = "";
//             let onlyQuestions = "";

//             let qsd = [];

//             for (let j = 0; j < mergedData.length; j++) {
//                 let a = mergedData[j];
//                 let b = "";
//                 b += (j + 1) + ".";
//                 b += "   " + a.column2 + "\n";
//                 b += "     " + "(a) " + a.column3 + "\n";
//                 b += "     " + "(b) " + a.column4 + "\n";
//                 b += "     " + "(c) " + a.column5 + "\n";
//                 b += "     " + "(d) " + a.column6 + "\n";
//                 onlyQuestions += b + "\n";
//                 b += "     " + "(ans) " + a.column7 + "\n";
//                 questionsWithAnswer += b + "\n";

//                 let c = { qno: a.column1, ans: a.column7 };
//                 qsd.push(c);
//             }
//             questionSetsData.push(qsd);
//             let character = 'a';
//             let asciiCode = character.charCodeAt(0);
//             asciiCode = asciiCode + i
//             const letter = String.fromCharCode(asciiCode);

//             const oq = 'results/' + name + '/onlyQuestion_set-' + letter + '.txt';
//             const qwa = 'results/' + name + '/questionWithAnswer_set-' + letter + '.txt';

//             fs.writeFileSync(qwa, questionsWithAnswer);
//             fs.writeFileSync(oq, onlyQuestions);
//         }

//         // Create a new Excel workbook and worksheet
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('Questions');

//         // Define the columns in the Excel sheet
//         worksheet.columns = [
//             { header: 'QNo.', key: 'Qno' },
//             { header: 'SetA', key: 'SetA' },
//             { header: 'AnsA', key: 'AnsA' },
//             { header: 'SetB', key: 'SetB' },
//             { header: 'AnsB', key: 'AnsB' },
//             { header: 'SetC', key: 'SetC' },
//             { header: 'AnsC', key: 'AnsC' },
//             { header: 'SetD', key: 'SetD' },
//             { header: 'AnsD', key: 'AnsD' },
//         ];

//         for (let j = 0; j < questionSetsData[0].length; j++) {

//             worksheet.addRow({
//                 Qno: j + 1,
//                 SetA: questionSetsData[0][j].qno,
//                 AnsA: questionSetsData[0][j].ans,
//                 SetB: questionSetsData[1][j].qno,
//                 AnsB: questionSetsData[1][j].ans,
//                 SetC: questionSetsData[2][j].qno,
//                 AnsC: questionSetsData[2][j].ans,
//                 SetD: questionSetsData[3][j].qno,
//                 AnsD: questionSetsData[3][j].ans,

//             });
//         }

//         const buffer = await workbook.xlsx.writeBuffer();
//         let p = 'results/' + name + '/SetsDetail.xlsx';

//         fs.writeFileSync(p, buffer);

//         res.status(200).send({ success: true, message: "Processing completed" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ success: false, error, message: "Error in generating question sets" });
//     }
// };

function processTextWithSubscripts(xmlString) {
  const parser = new xml2js.Parser({ explicitArray: false });
  let result = "";

  return parser
    .parseStringPromise(`<root>${xmlString}</root>`)
    .then((parsed) => {
      let runs = parsed.root.r;

      if (!Array.isArray(runs)) {
        runs = [runs];
      }

      runs.forEach((run) => {
        const isSubscript =
          run.rPr &&
          run.rPr.vertAlign &&
          run.rPr.vertAlign.$.val === "subscript";
        const text = run.t || "";

        if (isSubscript) {
          result += `<sub>${text}</sub>`;
        } else {
          result += text;
        }
      });

      return result;
    })
    .catch((err) => {
      console.error("Error parsing XML:", err);
      return "";
    });
}

function extractSymbolFromNumFmt(numFmt) {
  if (!numFmt) return null;

  // Use a regular expression to match the currency symbol at the beginning of the format
  const match = numFmt.match(/^[^\d#.,]+/);

  // Return the matched symbol without any surrounding spaces
  return match ? match[0].split("")[1] : null;
}
const shuffleAndEnsureUniquePosition = (data, usedQuestions, setIndex) => {
  let result = [];
  let availableQuestions = [...data];

  for (let i = 0; i < data.length; i++) {
    let question;

    // Try to find a question that hasn't been used in the same position across any set
    const possibleQuestions = availableQuestions.filter((q) => {
      return !usedQuestions.some((set) => set[i].has(q.column1));
    });

    if (possibleQuestions.length > 0) {
      // Randomly pick a question from available options that hasn't been used in this position
      const randomIndex = Math.floor(Math.random() * possibleQuestions.length);
      question = possibleQuestions[randomIndex];
    } else {
      // If all questions have been used in this position across all sets, pick any available one (rare case)
      question = availableQuestions[0];
    }

    // Add this question to the result set and mark it as used for this position in all sets
    result.push(question);
    usedQuestions[setIndex][i].add(question.column1);

    // Remove the question from the available pool
    availableQuestions = availableQuestions.filter(
      (q) => q.column1 !== question.column1
    );
  }

  return result;
};

export const genrateQuestionSetsController = async (req, res) => {
  try {
    let filePaths = req.files.map((file) => file.path);
    let { name, start } = req.body;
    start = Number(start);
    const parentFolder = "results";
    const newFolder = name;
    const newFolderPath = path.join(parentFolder, newFolder);
    if (!existsSync(newFolderPath)) {
      fs.mkdirSync(newFolderPath, { recursive: true });
    }

    // const fileReadPromises = filePaths.map(async (path) => {
    //   const workbook = new ExcelJS.Workbook();
    //   await workbook.xlsx.readFile(path);
    //   const worksheet = workbook.getWorksheet(); // Select the first worksheet by default
    //   if (!worksheet) {
    //     throw new Error("Worksheet not found in the Excel file.");
    //   }

    //   const data = [];
    //   const heading = [];

    //   worksheet.eachRow((row, rowNumber) => {
    //     if (rowNumber === 95) {
    //       console.log(row._cells[2]);
    //     }

    //     const rowData = {};
    //     row.eachCell((cell, colNumber) => {
    //       if (rowNumber === 1) {
    //         heading[colNumber - 1] = cell.value;
    //       } else {
    //         if (
    //           cell.value &&
    //           cell.value.richText &&
    //           cell.value.richText.length > 0
    //         ) {
    //           const formattedText = cell.value.richText
    //             .map((textObject) => {
    //               const vertAlign =
    //                 textObject.font && textObject.font.vertAlign;
    //               const text = textObject.text;
    //               if (text === "°") {
    //                 return "°"; // Keep the degree symbol as is
    //               }
    //               return vertAlign === "superscript"
    //                 ? superscriptMapping[text]
    //                 : text;
    //             })
    //             .join("");
    //           rowData[`column${colNumber}`] = formattedText;
    //         } else {
    //           rowData[`column${colNumber}`] = cell.value;
    //         }
    //       }
    //     });

    //     if (rowNumber !== 1) {
    //       data.push(rowData);
    //     }
    //   });

    //   return data;
    // });
    // let fileReadPromises = filePaths.map(async (filePath) => {
    //   const workbook = XLSX.readFile(filePath); // Reading the Excel file using SheetJS
    //   const sheetNames = workbook.SheetNames;
    //   const worksheet = workbook.Sheets[sheetNames[0]]; // Assuming you're using the first sheet

    //   if (!worksheet) {
    //     throw new Error("Worksheet not found in the Excel file.");
    //   }

    //   const data = [];
    //   const heading = [];

    //   // Convert the sheet to JSON and preserve rich text as needed
    //   const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    //     header: 1,
    //     defval: null,
    //   });

    //   jsonData.forEach((row, rowNumber) => {
    //     const rowData = {};
    //     let hasValidData = false; // Flag to check if the row has valid data

    //     row.forEach((cell, colNumber) => {
    //       if (rowNumber === 0) {
    //         heading[colNumber] = cell;
    //       } else {
    //         const cellAddress = XLSX.utils.encode_cell({
    //           r: rowNumber,
    //           c: colNumber,
    //         });
    //         const formattedValue =
    //           worksheet[cellAddress] && worksheet[cellAddress].w
    //             ? worksheet[cellAddress].w
    //             : cell;

    //         if (cell && typeof cell === "object" && cell.richText) {
    //           // Handle richText (preserving superscript, etc.)
    //           const formattedText = cell.richText
    //             .map((textObject) => {
    //               const vertAlign =
    //                 textObject.font && textObject.font.vertAlign;
    //               const text = textObject.text;
    //               if (text === "°") {
    //                 return "°"; // Keep the degree symbol as is
    //               }
    //               return vertAlign === "superscript"
    //                 ? superscriptMapping[text]
    //                 : text;
    //             })
    //             .join("");
    //           rowData[`column${colNumber + 1}`] = formattedText;
    //         } else {
    //           // Use formatted value or raw value depending on need
    //           rowData[`column${colNumber + 1}`] = formattedValue; // Using formatted value here
    //         }

    //         // Check if there's any valid data in the row
    //         if (
    //           formattedValue &&
    //           formattedValue !== null &&
    //           formattedValue !== ""
    //         ) {
    //           hasValidData = true;
    //         }
    //       }
    //     });

    //     // Only push the rowData if it contains valid data
    //     if (rowNumber !== 0 && hasValidData) {
    //       data.push(rowData);
    //     }
    //   });

    //   return data;
    // });
    // Function to convert to subscript
    // function convertToSubscript(text) {
    //   const subscriptMap = {
    //     0: "₀",
    //     1: "₁",
    //     2: "₂",
    //     3: "₃",
    //     4: "₄",
    //     5: "₅",
    //     6: "₆",
    //     7: "₇",
    //     8: "₈",
    //     9: "₉",
    //   };

    //   return text.replace(/\d/g, (match) => subscriptMap[match] || match);
    // }
    function getFormattedValue(cell) {
      // Extract the value and the rich text
      const symbolVal = cell.w;
      const value = cell.v; // e.g., 'CO2'
      const richText = cell.r; // e.g., '<r><t>CO</t></r><r><rPr><vertAlign val="subscript" ... /><t>2</t></r>'
      let formattedValue = "";
      // Check if the rich text has subscript formatting
      if (richText) {
        // Check if there is a subscript tag in the XML-like string
        const parser = new Parser({
          onopentag(name, attributes) {
            // Handle <r> tags (run tags)
            if (name === "r") {
              this.isSubscript = false;
              if (attributes) {
                // Check for subscript formatting in the <rPr> tag
                if (attributes["vertAlign"] === "subscript") {
                  this.isSubscript = true; // Mark this as subscript
                }
              }
            }
          },
          ontext(text) {
            if (this.isSubscript) {
              // If it's marked as subscript, convert the text to subscript
              text = convertToSubscript(text);
            }

            // Output the text (you could append this to a result string)
            console.log(`Processed Text: ${text}`);
          },
          onclosetag(tagname) {
            // Handle closing tags if needed (not essential for this case)
            if (tagname === "r") {
              console.log(`Closing tag: </${tagname}>`);
            }
          },
        });

        // Start parsing the XML content
        parser.write(richText);
        parser.end();

        formattedValue = parser.currentText;
      } else {
        formattedValue = value;
      }

      // If no subscript found, just return the original value
      return formattedValue;
    }

    // let fileReadPromises = filePaths.map(async (filePath) => {
    //   const workbook = XLSX.readFile(filePath); // Reading the Excel file using SheetJS
    //   const sheetNames = workbook.SheetNames;
    //   const worksheet = workbook.Sheets[sheetNames[0]]; // Assuming you're using the first sheet

    //   if (!worksheet) {
    //     throw new Error("Worksheet not found in the Excel file.");
    //   }

    //   const data = [];
    //   const heading = [];

    //   // Convert the sheet to JSON and preserve rich text as needed
    //   const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    //     header: 1, // Treat the first row as the header
    //     defval: null,
    //   });
    //   jsonData.unshift([]);
    //   jsonData.unshift([]);
    //   jsonData.unshift([]);
    //   jsonData.unshift([]);
    //   jsonData.unshift([]);
    //   jsonData.unshift([]);

    //   jsonData.forEach((row, rowNumber) => {
    //     // Start processing from row 8 (rowNumber 7 in zero-indexed)
    //     // console.log(rowNumber);
    //     if (rowNumber < 6) {
    //       return; // Skip rows before row 7 (header row)
    //     }

    //     const rowData = {};
    //     let hasValidData = false; // Flag to check if the row has valid data

    //     row.forEach((cell, colNumber) => {
    //       if (rowNumber === 100) {
    //         // This is the header row (row 7), so store it
    //         heading[colNumber] = cell;
    //       } else {
    //         console.log("called");
    //         const cellAddress = XLSX.utils.encode_cell({
    //           r: rowNumber,
    //           c: colNumber,
    //         });
    //         // console.log(cellAddress);
    //         // console.log(worksheet[cellAddress]);
    //         const cell = worksheet[cellAddress];
    //         console.log(cell);
    //         // const formattedValue =
    //         //   worksheet[cellAddress] && worksheet[cellAddress].w
    //         //     ? worksheet[cellAddress].w
    //         //     : cell;
    //         // const cell = worksheet[cellAddress];
    //         const formattedValue = getFormattedValue(cell);
    //         // console.log(formattedValue);
    //         // Check if the cell has rich text and format accordingly
    //         // if (cell && typeof cell === "object" && cell.richText) {
    //         //   const formattedText = cell.richText
    //         //     .map((textObject) => {
    //         //       const vertAlign =
    //         //         textObject.font && textObject.font.vertAlign;
    //         //       const text = textObject.text;
    //         //       if (rowNumber === 8) {
    //         //         console.log(cell);
    //         //       }
    //         //       if (text === "°") {
    //         //         return "°"; // Keep the degree symbol as is
    //         //       }

    //         //       // Check for superscript formatting for "²"
    //         //       if (text === "2" && vertAlign === "superscript") {
    //         //         return text + "²"; // Add squared symbol if the text is "2" and formatted as superscript
    //         //       }

    //         //       return vertAlign === "superscript"
    //         //         ? superscriptMapping[text]
    //         //         : text;
    //         //     })
    //         //     .join("");
    //         //   rowData[`column${colNumber + 1}`] = formattedText;
    //         // } else {
    //         //   // Check if the value is numeric and might represent a degree or square
    //         //   let valueToStore = formattedValue;

    //         //   // Check if valueToStore is a number and could represent degrees
    //         //   if (!isNaN(valueToStore)) {
    //         //     // Apply conversion only if it's in a "degree-like" format (e.g., 300 should become 30°)
    //         //     if (valueToStore >= 100 && valueToStore % 100 === 0) {
    //         //       // Convert minute values to degree values by dividing by 10
    //         //       valueToStore = valueToStore / 10 + "°"; // Convert to degrees and add symbol
    //         //     }
    //         //     // Check if the value is "4" and should be treated as a square
    //         //     if (valueToStore === 4) {
    //         //       valueToStore = valueToStore + "²"; // Add square symbol
    //         //     }
    //         //   }

    //         //   rowData[`column${colNumber + 1}`] = valueToStore;
    //         // }

    //         // Check if there's any valid data in the row
    //         // if (
    //         //   formattedValue &&
    //         //   formattedValue !== null &&
    //         //   formattedValue !== ""
    //         // ) {
    //         //   hasValidData = true;
    //         // }
    //       }
    //     });

    //     // Only push the rowData if it contains valid data
    //     if (hasValidData) {
    //       data.push(rowData);
    //     }
    //   });

    //   return data;
    // });
    let fileReadPromises = filePaths.map(async (filePath) => {
      const workbook = XLSX.readFile(filePath); // Reading the Excel file using SheetJS
      const sheetNames = workbook.SheetNames;
      const worksheet = workbook.Sheets[sheetNames[0]]; // Assuming you're using the first sheet

      if (!worksheet) {
        throw new Error("Worksheet not found in the Excel file.");
      }

      const data = [];
      const heading = [];

      // Convert the sheet to JSON and preserve rich text as needed
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1, // Treat the first row as the header
        defval: null,
      });

      jsonData.unshift([]);
      jsonData.unshift([]);
      jsonData.unshift([]);
      jsonData.unshift([]);
      jsonData.unshift([]);
      jsonData.unshift([]);
      jsonData.forEach((row, rowNumber) => {
        const rowData = {}; // Object to store row data

        row.forEach((cell, colNumber) => {
          const cellAddress = XLSX.utils.encode_cell({
            r: rowNumber,
            c: colNumber,
          });

          let formattedValue = null;

          // Ensure the cell exists in the worksheet before accessing properties
          if (worksheet[cellAddress]) {
            const cell = worksheet[cellAddress]; // Access the cell object
            const cellHtml = cell.h; // HTML representation
            const cellSymbol = cell.w; // Displayed value (e.g., "3.75 cm²")
            const cellValue = cell.v; // Raw value (unformatted)

            // Use `convertHtmlToText` for HTML content
            if (cellHtml) {
              formattedValue = convertHtmlToText(cellHtml);
            } else if (cellSymbol) {
              // Fallback to formatted display value
              formattedValue = cellSymbol;
            } else if (cellValue !== undefined) {
              // Fallback to raw value
              formattedValue = cellValue;
            } else {
              // Handle completely empty cells
              formattedValue = null;
            }
          } else {
            // Handle missing cells (non-existent in worksheet)
            formattedValue = null;
          }

          // Dynamically assign the formatted value to the rowData object
          rowData[`column${colNumber + 1}`] = formattedValue;
        });

        if (rowData.column1 !== null) {
          data.push(rowData);
        }
      });

      return data;
    });

    let filesData = await Promise.all(fileReadPromises);

    let data = filesData[0];
    data.splice(0, 7);
    // console.log(data.splice(7));
    console.log(data);
    // return;
    let inputFileWithAnswer = "";
    let inputFileWithOutAnswer = "";
    for (let i = 0; i < data.length; i++) {
      let a = data[i];
      let b = "";
      b += i + 1 + start - 1 + ".";
      b += "   " + a.column2 + "\n";
      b += "     " + "(a) " + a.column3 + "\n";
      b += "     " + "(b) " + a.column4 + "\n";
      b += "     " + "(c) " + a.column5 + "\n";
      b += "     " + "(d) " + a.column6 + "\n";
      inputFileWithOutAnswer += b + "\n";
      b += "     " + "(ans) " + a.column7 + "\n";
      inputFileWithAnswer += b + "\n";
    }

    const oq = "results/" + name + "/Original_set" + ".txt";
    const qwa = "results/" + name + "/Original_Set_WithAnswer" + ".txt";

    fs.writeFileSync(qwa, inputFileWithAnswer);
    fs.writeFileSync(oq, inputFileWithOutAnswer);

    let questionSetsData = [];
    const usedQuestions = Array.from({ length: 4 }, () =>
      Array.from({ length: data.length }, () => new Set())
    );

    for (let i = 0; i < 4; i++) {
      console.log("Generating set ", i + 1);

      let shuffledData = shuffleAndEnsureUniquePosition(data, usedQuestions, i);
      let questionsWithAnswer = "";
      let onlyQuestions = "";
      let qsd = [];

      for (let j = 0; j < shuffledData.length; j++) {
        let a = shuffledData[j];
        let b = "";
        b += j + 1 + start - 1 + ".";
        b += "   " + a.column2 + "\n";
        b += "     " + "(a) " + a.column3 + "\n";
        b += "     " + "(b) " + a.column4 + "\n";
        b += "     " + "(c) " + a.column5 + "\n";
        b += "     " + "(d) " + a.column6 + "\n";
        onlyQuestions += b + "\n";
        b += "     " + "(ans) " + a.column7 + "\n";
        questionsWithAnswer += b + "\n";

        let c = { qno: a.column1, ans: a.column7 };
        qsd.push(c);
      }

      questionSetsData.push(qsd);
      const letter = String.fromCharCode("a".charCodeAt(0) + i);

      const oq = "results/" + name + "/onlyQuestion_set-" + letter + ".txt";
      const qwa =
        "results/" + name + "/questionWithAnswer_set-" + letter + ".txt";

      fs.writeFileSync(qwa, questionsWithAnswer);
      fs.writeFileSync(oq, onlyQuestions);
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Questions");

    worksheet.columns = [
      { header: "QNo.", key: "Qno" },
      { header: "SetA", key: "SetA" },
      { header: "AnsA", key: "AnsA" },
      { header: "SetB", key: "SetB" },
      { header: "AnsB", key: "AnsB" },
      { header: "SetC", key: "SetC" },
      { header: "AnsC", key: "AnsC" },
      { header: "SetD", key: "SetD" },
      { header: "AnsD", key: "AnsD" },
    ];

    for (let j = 0; j < questionSetsData[0].length; j++) {
      worksheet.addRow({
        Qno: j + 1 + start - 1,
        SetA: questionSetsData[0][j].qno,
        AnsA: questionSetsData[0][j].ans,
        SetB: questionSetsData[1][j].qno,
        AnsB: questionSetsData[1][j].ans,
        SetC: questionSetsData[2][j].qno,
        AnsC: questionSetsData[2][j].ans,
        SetD: questionSetsData[3][j].qno,
        AnsD: questionSetsData[3][j].ans,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const excelPath = "results/" + name + "/SetsDetail.xlsx";
    fs.writeFileSync(excelPath, buffer);

    res
      .status(200)
      .send({ success: true, message: "Processing completed", data: data });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in generating question sets",
    });
  }
};

function generateSuperscriptMap() {
  const superscriptMap = {};

  for (let i = 0; i <= 1000; i++) {
    const key = i.toString();
    const superscriptValue =
      i < 10 ? convertToSuperscript(i) : convertToSuperscriptTens(i);

    superscriptMap[key] = superscriptValue;
  }

  return superscriptMap;
}

function convertToSuperscript(number) {
  const superscripts = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

  return number
    .toString()
    .split("")
    .map((digit) => superscripts[digit])
    .join("");
}

function convertToSuperscriptTens(number) {
  const tens = Math.floor(number / 10);
  const units = number % 10;

  if (tens === 1) {
    return `¹${convertToSuperscript(units)}`;
  } else {
    return `${convertToSuperscript(tens)}${convertToSuperscript(units)}`;
  }
}

const superscriptMapping = generateSuperscriptMap();

// console.log(superscriptMapping);
