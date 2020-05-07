import React from 'react';
import FileUploadForm from './components/FileUploadForm.js'

function App() {
  return (
    <FileUploadForm onSubmit={_ => console.log('handle submit')} />
  );
}

export default App;
