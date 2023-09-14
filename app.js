// const API_KEY = "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";
// const submitBtn = document.querySelector("#submit");
// const btnEl = document.querySelector("button");
// const outputEl = document.querySelector("#output");
// const inputEl = document.querySelector("input");
// const historyEl = document.querySelector(".history");

// function changeInput(value) {
//   inputEl.value = value;
// }
// async function getMessage() {

//   try {
//     const response = await fetch(
//       "https://api.openai.com/v1/chat/completions",
//       options
//     );
//     const data = await response.json();
//     console.log(data);
//     outputEl.textContent = data.choices[0].message.content;

//     if (data.choices[0].message.content && inputEl.value) {
//       const pEl = document.createElement("p");
//       pEl.textContent = inputEl.value;
//       pEl.addEventListener("click", () => changeInput(pEl.textContent));
//       historyEl.append(pEl);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// function clearInput() {
//   inputEl.value = "";
// }

// submitBtn.addEventListener("click", getMessage);
// btnEl.addEventListener("click", clearInput);

const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();

const API_KEY = "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";

app.use(express.json());
app.use(cors());

app.post("/completions", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.message }],
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});
app.listen(PORT, () => console.log("Your server is running on PORT " + PORT));
