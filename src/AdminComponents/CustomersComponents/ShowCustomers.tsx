/**
 * This component is responsible for showing all the customers in the dataBase.
 * It also loads one or none of the three components: AddCustomer, DeleteCompany, UpdateCompany.
 * It 
 */
import { useCallback, useEffect, useState } from "react";
import { CustomerType } from "../../ClientTypes/Models/CustomerModel";
import CustomerList from "../../ClientTypes/ModelsList/CustomerList";
import UpdateCustomer from "./UpdateCustomer";
import DeleteCustomer from "./DeleteCustomer";
import AddCustomer from "./AddCustomer";
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { CircularProgress, Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { useHistory } from "react-router-dom";

type Props = {
  token: string
  reload: boolean
  open?: boolean
}

const ShowCustomers: React.FC<Props> = (props) => {
  const history = useHistory();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [customerIdForRemove, setCustomerIdForRemove] = useState<number>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [customerToUpdate, setCustomerToUpdate] = useState<CustomerType>(null);
  const [open, setOpen] = useState(false);
  const theme = createTheme();

  //opens the alert pop-up if triggered
  const AlertOpenHandler = () => {
    setOpen(true);
  };

  //closes the alert popup if the conditions are met
  const alertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  //It updates the customer in the frontend
  const updateCustomerHandler = (dataForUpdate) => {
    const newState = customers.map(customerToChange => { if (customerToChange.id === customerToUpdate.id) { return { ...customerToChange, firstName: dataForUpdate.firstName, lastName: dataForUpdate.lastName, email: dataForUpdate.email, password: dataForUpdate.password } } return customerToChange; });
    console.log(newState)
    setCustomers(newState);
  }

  //It cancels the adding of new customer (conditional)
  const cancelHandler = () => {
    setIsAdding(false);
  }

  // when finished adding new customer, it sends the data here and it opens the alert-popup
  const finish = (customer: CustomerType) => {
    setCustomers([customer, ...customers])
    setIsAdding(false)
    AlertOpenHandler()
  }

  //It starts the updating process (conditional)
  const onUpdate = (customer: CustomerType) => {

    setCustomerToUpdate(customer)
    setIsUpdating(true)
  }

  // when finished updating it closes the updating process (conditional) 
  const onConfirm = () => {
    setIsUpdating(false)
  }

  //It deletes the customer from the frontend
  const onDelete = (id: number) => {
    const customersDummy = customers;
    const removeIndex = customersDummy.findIndex(item => item.id === id);
    customersDummy.splice(removeIndex, 1);
    setCustomers(customersDummy)

    setCustomerIdForRemove(id);
    setIsDeleting(true);
  }

  //when finished deleting it closes the deleting process (conditional) 
  const onConfirmDelete = () => {
    setIsDeleting(false)
  }

  //it fetches all the customers data from the backend, if there is error, it goes to the error page
  const fetchHandler = useCallback(async () => {
    setIsLoading(true);
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: { "Content-Type": "application/json", "token": props.token },
    }
    let response
    try {
      response = await fetch("http://localhost:8080/adminApi/getAllCustomers", requestOptions);
    } catch (e) {
      history.push('/PageNotFound')
    }
    if (!response.ok) {
      if (await response.text() === "Service is not found") {
        console.log("hello1")
        history.push('/login')
      }
      else {
        console.log("hello2")
        history.push('/PageNotFound')
      }
    }

    const data = await response.json();
    setCustomers(data);
    setIsLoading(false);
  }, [])

  useEffect(() => {
    fetchHandler();
    setIsAdding(false);
  }, [props.reload, props.open])

  return (
    <section>
      {/*plus button*/}

      <Stack
        sx={{ pt: 4 }}
        direction="row"
        spacing={2}
        justifyContent="center"
      >
        {!isAdding && <Button onClick={() => setIsAdding(true)} variant="contained" size="large" >+</Button>}
      </Stack>
      <br /><br />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          <Container maxWidth='xs'>
            {!isAdding && <Typography
              component="h2"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
            >
              All Customers
            </Typography>}
          </Container>
          <Container sx={{ py: 0 }} >
            <Grid container spacing={1}>
              {!isAdding && !isLoading && customers.length > 0 && <CustomerList customerList={customers} token={props.token} onDelete={onDelete} onUpdate={onUpdate} />}
              {!isLoading && customers.length === 0 && <p>No companies Found.</p>}
              {isLoading && <Box sx={{ display: 'flex', mx: "50%" }}>
                <CircularProgress />
              </Box>}
            </Grid>
          </Container>
        </main>
      </ThemeProvider>
      {isDeleting && <DeleteCustomer token={props.token} onConfirmDelete={onConfirmDelete} id={customerIdForRemove} />}
      {isUpdating && <UpdateCustomer token={props.token} customer={customerToUpdate} onConfirm={onConfirm} updateCustomer={updateCustomerHandler} />}
      {isAdding && <AddCustomer token={props.token} cancel={cancelHandler} finish={finish} />}
      {/*alert*/}
      <Snackbar open={open} autoHideDuration={6000} onClose={alertClose}>
        <MuiAlert elevation={6} onClose={alertClose} sx={{ width: '100%' }}>
          Customer was added successfully!
        </MuiAlert>
      </Snackbar>
    </section>
  );
};

export default ShowCustomers;