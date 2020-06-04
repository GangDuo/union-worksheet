import React from 'react';
import FileUploadForm from './components/FileUploadForm.js'
const XLSX = require('xlsx')
const unzip = require('unzip-stream');
var http = require('http');

function saveAs(data, filename) {
  const workbook = XLSX.utils.book_new()
  const sheet = XLSX.utils.json_to_sheet(data)
   
  // すべてのセルの書式設定を文字列にする
  Object.keys(sheet).map(x => sheet[x] = Object.assign(sheet[x], {'z': '@'}))
  XLSX.utils.book_append_sheet(workbook, sheet)
  return XLSX.writeFile(workbook, filename)
}

function download(url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "arraybuffer";
  
  req.onerror = () => {
    callback(new Error("** An error occurred during the transaction"))
  };
  req.onload = (e) => {
    console.log(url);
    callback(null, req.response)
  }
  
  req.send();
}

function readXlsxAsJson(buf) {
  var data = new Uint8Array(buf);
  var workbook = XLSX.read(data, {type:"array"});

  /* DO SOMETHING WITH workbook HERE */
  const sheet1 = workbook.Sheets[workbook.SheetNames[0]]
  return XLSX.utils.sheet_to_json(sheet1)
}

function makeJob(values) {
  return values.loadedFiles.map(file => {
    return new Promise((resolve, reject) => {
      console.log(file)
      http.request(file, function(res) {
        res.pipe(unzip.Parse())
        .on('entry', function (entry) {
          const filePath = entry.path;
          console.log(filePath)
        })
        /*
        .on('end', _=>{
          console.log('end')
          resolve({})
        })
        */
      
      })
    })

    if(file.path.endsWith('zip')) {
      
      
    } else {
      return new Promise((resolve, reject) => {
        download(file, (err, response) => {
          if(err) {
            reject(err)
            return
          }
          const sheet1AsJson = readXlsxAsJson(response)
          console.log(sheet1AsJson);
          resolve(sheet1AsJson)
        })
      })  
    }
  })
}

function App() {
  return (
    <FileUploadForm onSubmit={(values, { setSubmitting }) => {
      console.log(JSON.stringify(values, null, 2));
      return new Promise((resolve, reject) => {
        setImmediate(_ => {
          resolve(makeJob(values))
        })
      })
      .then(jobs => Promise.all(jobs))
      .then((data) => {
        const file = saveAs(Array.prototype.concat.apply([], data), "filename.xlsx")
        setSubmitting(false);
        return Promise.resolve(file)
      })
    }} />
  );
}

export default App;