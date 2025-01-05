export const genrateQuestionSetsController = async (req, res) => {
  try {
    let filePaths = req.files.map((file) => file.path);
    let { name, start } = req.body;
    start = Number(start);
    const parentFolder = "results";
    const newFolder = name;
    const newFolderPath = path.join(parentFolder, newFolder);
    if (!existsSync(newFolderPath)) {
      fs.mkdirSync(newFolderPath);
    }

    // let fileReadPromises = filePaths.map(async (path) => {
    //     const workbook = new ExcelJS.Workbook();
    //     await workbook.xlsx.readFile(path);
    //     const worksheet = workbook.getWorksheet();
    //     if (!worksheet) {
    //         throw new Error('Worksheet not found in the Excel file.');
    //     }

    //     let data = [];
    //     const heading = [];

    //     worksheet.eachRow((row, rowNumber) => {
    //         const rowData = {};
    //         row.eachCell((cell, colNumber) => {
    //             if (rowNumber === 1) {
    //                 heading[colNumber - 1] = cell.value;
    //             } else {
    //                 if (cell.value && cell.value.richText && cell.value.richText.length > 0) {
    //                     const formattedText = cell.value.richText.map((textObject) => {
    //                         const vertAlign = textObject.font && textObject.font.vertAlign;
    //                         const text = textObject.text;
    //                         if (text === '°') {
    //                             return '°'; // Keep the degree symbol as is
    //                         }
    //                         return vertAlign === 'superscript' ? superscriptMapping[text] : text;
    //                     }).join('');
    //                     rowData[`column${colNumber}`] = formattedText;
    //                 } else {
    //                     rowData[`column${colNumber}`] = cell.value;
    //                 }
    //             }
    //         });
    //         if (rowNumber !== 1) {
    //             data.push(rowData);
    //         }
    //     });

    //     data.shift();
    //     return data;
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
        header: 1,
        defval: null,
      });
      jsonData.forEach((row, rowNumber) => {
        const rowData = {};
        row.forEach((cell, colNumber) => {
          if (rowNumber === 0) {
            heading[colNumber] = cell;
          } else {
            const cellAddress = XLSX.utils.encode_cell({
              r: rowNumber,
              c: colNumber,
            });
            const formattedValue =
              worksheet[cellAddress] && worksheet[cellAddress].w
                ? worksheet[cellAddress].w
                : cell;

            if (cell && typeof cell === "object" && cell.richText) {
              // Handle richText (preserving superscript, etc.)
              const formattedText = cell.richText
                .map((textObject) => {
                  const vertAlign =
                    textObject.font && textObject.font.vertAlign;
                  const text = textObject.text;
                  if (text === "°") {
                    return "°"; // Keep the degree symbol as is
                  }
                  return vertAlign === "superscript"
                    ? superscriptMapping[text]
                    : text;
                })
                .join("");
              rowData[`column${colNumber + 1}`] = formattedText;
            } else {
              // Use formatted value or raw value depending on need
              rowData[`column${colNumber + 1}`] = formattedValue; // Using formatted value here
            }
          }
        });

        if (rowNumber !== 0) {
          data.push(rowData);
        }
      });

      return data;
    });

    let filesData = await Promise.all(fileReadPromises);
    // console.log(filesData);
    let data = filesData[0];
    console.log(data);
    return;
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

    res.status(200).send({ success: true, message: "Processing completed" });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in generating question sets",
    });
  }
};

