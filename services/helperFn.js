import { htmlToText } from "html-to-text";

export const convertHtmlToText = (text) => {
  //   console.log(">>>", text);
  text = `<body>${text}</body>`;
//   console.log(">>>", text);
  const superscriptMap = {
    0: "⁰",
    1: "¹",
    2: "²",
    3: "³",
    4: "⁴",
    5: "⁵",
    6: "⁶",
    7: "⁷",
    8: "⁸",
    9: "⁹",
    "+": "⁺",
    "-": "⁻",
    "=": "⁼",
    "(": "⁽",
    ")": "⁾",
  };

  const subscriptMap = {
    0: "₀",
    1: "₁",
    2: "₂",
    3: "₃",
    4: "₄",
    5: "₅",
    6: "₆",
    7: "₇",
    8: "₈",
    9: "₉",
    "+": "₊",
    "-": "₋",
    "=": "₌",
    "(": "₍",
    ")": "₎",
  };

  // Replace numbers in superscript
  text = text.replace(/<sup>(\d+)<\/sup>/g, (match, number) => {
    return number
      .split("")
      .map((digit) => superscriptMap[digit] || digit)
      .join("");
  });

  // Replace numbers in subscript
  text = text.replace(/<sub>(\d+)<\/sub>/g, (match, number) => {
    return number
      .split("")
      .map((digit) => subscriptMap[digit] || digit)
      .join("");
  });
  return htmlToText(text, { wordwrap: false });
};
