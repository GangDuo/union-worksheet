import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Container, Button, LinearProgress, FormControlLabel, Radio, Grid } from '@material-ui/core';
import { RadioGroup, Switch } from 'formik-material-ui';
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
  const [toggle, setToggle] = React.useState(true);
  const myRef = React.createRef();
  
  React.useEffect(() => {
    console.log("addEventListener");
    myRef.current.querySelector('input[name="hasHeader"]').addEventListener("change", () => {
      console.log(toggle)
      setToggle(!toggle)
      console.log(toggle)
    })

    return function cleanup() {
      console.log("cleanup");
    };
  });

  return (
    <Formik
      initialValues={{
      	direction: '有',
        hasHeader: true,
      }}      
      onSubmit={onSubmit}
    >
      {({ submitForm, isSubmitting, setFieldValue }) => (
        <Container maxWidth="sm">
        <Form>
          <fieldset>
            <legend>ヘッダ</legend>
            <FormControlLabel
              control={
                <Field
                  name="hasHeader"
                  component={Switch}
                  defaultChecked
                  innerRef={myRef}
                />
              }
              label="ヘッダあり"
            />

            <Field component={RadioGroup} name="direction">
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="flex-start"
              >
              {
                ['無', '有']
                .map((x, i) => <FormControlLabel key={i}
                                                control={<Radio disabled={isSubmitting} />}
                                                value={x}
                                                label={x}
                                                disabled={isSubmitting}/>)
              }
              </Grid>
            </Field>
          </fieldset>
          
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