import React, { useState, useEffect } from 'react';
import './App.css';
import { forwardRef } from 'react';
import Avatar from 'react-avatar';
import Grid from '@material-ui/core/Grid'
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { Snackbar } from '@material-ui/core';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import validateEmail from '../helpers/helpers';
import apiClient from "../../src/config/config";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


const App = () => {

  const columns = [
    { title: "id", field: "id", hidden: true },
    { title: "Avatar", render: rowData => <Avatar maxInitials={1} size={40} round={true} name={rowData === undefined ? " " : rowData.name} /> },
    { title: "Nombre", field: "name" },
    { title: "Apellido", field: "lastName" },
    { title: "Profesión", field: "profesion" },
    { title: "email", field: "email" }
  ]
  const [data, setData] = useState([]); //table data
  const [isFetching, setIsFetching] = useState(true); //table data

  //for error handling
  const [isError, setIsError] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const myInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`${apiClient.users}/`, myInit)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsFetching(false);
      })
      .catch(err => {
        setIsFetching(false);
      });
  }, [])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleRowUpdate = (newData, oldData, resolve) => {
    const { id } = newData;
    //validation
    let errorList = []
    if (!newData.name || !newData.lastName || !newData.profesion) {
      errorList.push("La información no puede estar en blanco.")
    }
    if (!newData.email || !validateEmail(newData.email)) {
      errorList.push("Ingrese un correo válido.")
    }

    if (errorList.length < 1) {
      const myInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      };
      fetch(`${apiClient.users}/${id}`, myInit)
        .then(resObj => {
          const dataUpdate = [...data];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          setData([...dataUpdate]);
          resolve()
          setIsError(false)
          setErrorMessages([])
        })
        .catch(err => {
          setErrorMessages(["Error de servidor intentando actualizar."])
          setIsError(true)
          resolve()
        });
    } else {
      setOpen(true)
      setErrorMessages(errorList)
      setIsError(true)
      resolve()

    }

  }

  const handleRowAdd = (newData, resolve) => {
    //validation
    let errorList = []
    if (!newData.name || !newData.lastName || !newData.profesion) {
      errorList.push("La información no puede estar en blanco.")
    }
    if (!newData.email || !validateEmail(newData.email)) {
      errorList.push("Ingrese un correo válido.")
    }

    if (errorList.length < 1) { //no error
      const myInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      };
      fetch(`${apiClient.users}/`, myInit)
        .then(res => res.json())
        .then(resObj => {
          let dataToAdd = [...data];
          dataToAdd.push(resObj);
          setData(dataToAdd);
          resolve()
          setErrorMessages([])
          setIsError(false)
        })
        .catch(err => {
          setErrorMessages(["Error de servidor intentando crear."])
          setIsError(true)
          resolve()
        });

    } else {
      setOpen(true)
      setErrorMessages(errorList)
      setIsError(true)
      resolve()
    }


  }

  const handleRowDelete = (oldData, resolve) => {
    const { id, tableData } = oldData;
    const myInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`${apiClient.users}/${id}`, myInit)
      .then(resObj => {
        const dataDelete = [...data];
        const index = tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve()
      })
      .catch(err => {
        setErrorMessages(["Error en servidor tratando de borrar."])
        setIsError(true)
        resolve()
      });

  }

  return (
    <div className="App">

      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <MaterialTable
            className="user-table"
            title="Lista de usuarios de API Clever"
            columns={columns}
            localization={{ toolbar: { searchPlaceholder: 'Buscar...' } },
            {
              body: {
                editRow: { deleteText: '¿Estás seguro de borrar el registro de la lista CleverIT ?' },
                emptyDataSourceMessage: (isFetching) ? <CircularProgress /> : 'Sin información para mostrar'
              }
            }}
            data={data}
            icons={tableIcons}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  handleRowUpdate(newData, oldData, resolve);

                }),
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  handleRowAdd(newData, resolve)
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  handleRowDelete(oldData, resolve)
                }),
            }}
          />
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>

        {isError &&
          <Alert severity="error" onClose={handleClose} >
            {errorMessages.map((msg, i) => {
              return <div key={i}>{msg}</div>
            })}
          </Alert>
        }

      </Snackbar>
    </div>
  );
}

export default App;