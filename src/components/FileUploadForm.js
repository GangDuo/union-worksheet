import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Container, Button, LinearProgress } from '@material-ui/core';
import {DropzoneArea} from 'material-ui-dropzone'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function FileUploadForm({ onSubmit }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <Formik
      initialValues={{}}      
      onSubmit={onSubmit}
    >
      {({ submitForm, isSubmitting, setFieldValue }) => (
        <Container maxWidth="sm">
        <Form>
          
          <fieldset>
            <legend>Excelファイル</legend>

            <Field component={DropzoneArea}
                   acceptedFiles={[
                     'application/vnd.ms-excel',
                     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                     'application/zip',
                     'application/x-compressed',
                     'application/x-zip-compressed']}
                   maxFileSize={10000000/* 10Mbytes */}
                   filesLimit={99}
                   showFileNames={true}
                   onDrop={droppedFiles => {
                     setOpen(true);
                     console.log(droppedFiles)
                   }}
                   onChange={loadedFiles => {
                    setOpen(false);
                    console.log('DropzoneArea.onChange')
                     if(loadedFiles.length === 0) return;
                     setFieldValue('loadedFiles', loadedFiles.map(x=>URL.createObjectURL(x)))
                   }} />
            <input type="hidden" name="loadedFiles" />
          </fieldset>

          {isSubmitting && <LinearProgress />}
          <br />
          <Button
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            onClick={submitForm}
          >
            結合
          </Button>
        </Form>
        <Backdrop className={classes.backdrop} open={open} >
          <CircularProgress color="inherit" />
        </Backdrop>
        </Container>
      )}
    </Formik>
  );
}

export default FileUploadForm;