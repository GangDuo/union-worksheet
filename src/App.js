import React from 'react';
import FileUploadForm from './components/FileUploadForm.js'

function App() {
  return (
    <FileUploadForm onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        setSubmitting(false);
        alert(JSON.stringify(values, null, 2));
      }, 500);
    }} />
  );
}

export default App;
