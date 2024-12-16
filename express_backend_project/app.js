const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

const executePython = async (script, args) => {
  const arguments = args.map((arg) => arg.toString());
  const py = spawn("python3.10", [script, ...arguments]);
  const result = await new Promise((resolve, reject) => {
    let output;
    py.stdout.on("data", (data) => {
      output = JSON.parse(data);
    });
    py.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
      reject(`Error occured: ${data}`);
    });
    py.on("exit", (code) => {
      console.log(`Process exited with code ${code}`);
      resolve(output);
    });
  });
  return result;
};

app.get("/", async (req, res) => {
  try {
    const result = await executePython("python/test.py");
    res.json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/data", (req, res) => {
  let dataToSend;

  const pythonProcess = spawn("python3.10", ["python/script.py"]);
  // collect data from script
  pythonProcess.stdout.on("data", function (data) {
    // dataToSend = data.toString();
    // dataToSend = JSON.parse(data);
    dataToSend = "hello World";
  });

  // close stream from child process
  pythonProcess.on("exit", (code) => {
    console.log(`Data sent successfully ${code}`);
    res.send(dataToSend);
  });
  //res.send("Hello World");
});
