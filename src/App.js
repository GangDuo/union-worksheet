import React from 'react';
import FileUploadForm from './components/FileUploadForm.js'
const XLSX = require('xlsx')

function App() {
  return (
    <FileUploadForm onSubmit={(values, { setSubmitting }) => {
      new Promise((resolve, reject) => {
        setImmediate(_ => {
          const workbook = XLSX.utils.book_new()
          const sheet = XLSX.utils.json_to_sheet([{a:1,b:2}])
          // すべてのセルの書式設定を文字列にする
          Object.keys(sheet).map(x => sheet[x] = Object.assign(sheet[x], {'z': '@'}))
          XLSX.utils.book_append_sheet(workbook, sheet)
          resolve(XLSX.writeFile(workbook, "filename.xlsx"));
          setSubmitting(false);
          console.log(JSON.stringify(values, null, 2));
        });
      })
      .then(file => file);
    }} />
  );
}

export default App;
