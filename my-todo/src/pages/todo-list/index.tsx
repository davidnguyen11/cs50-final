import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Fab,
  Container,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Box,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { useAuthState } from '../../contexts/auth';
import { TodoDialog } from '../../components/Dialog';
import { API_END_POINT } from '../../utils/constants';
import { useRouter } from 'next/router';
import { withHeader } from '../../hoc/withHeader';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

function TodoListPage(props) {
  const { status, data } = props;
  const router = useRouter()
  const [todoList, setTodoList] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [todoListDetail, setTodoListDetail] = useState(undefined);
  const [dialogType, setDialogType] = useState(undefined);
  const [dialogMode, setDialogMode] = useState(undefined);
  const [dialogTitle, setDialogTitle] = useState(undefined);
  const { token } = useAuthState();
  const classes = useStyles();

  useEffect(() => {
    switch (status) {
      case 'success':
        setTodoList(data);
        break;
    }
  }, []);

  const handleCloseDialog = () => {
    setTodoListDetail(undefined);
    setOpenAddDialog(false);
  }

  const handleAddTodo = async (title: string) => {
    const response = await fetch(`${API_END_POINT}/todo-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });
    const { status, data, error } = await response.json();

    switch (status) {
      case 'success':
        const newData = [data].concat(...todoList);
        setTodoList(newData);
        break;
      case 'error':
        setErrorMessage(error.message);
        setOpenSnackBar(true);
        break;
    }
    setOpenAddDialog(false);
  }

  const handleUpdateTodo = async (title: string) => {
    const response = await fetch(`${API_END_POINT}/todo-list/${todoListDetail.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });
    const { status, data, error } = await response.json();

    switch (status) {
      case 'success':
        const newData = [...todoList];
        newData.forEach(item => {
          if (item.id == data.id) {
            item.title = data.title;
          }
        })
        setTodoList(newData);
        break;
      case 'error':
        setErrorMessage(error.message);
        setOpenSnackBar(true);
        break;
    }
    setOpenAddDialog(false);
    setTodoListDetail(undefined);
  }

  const handleDeleteTodo = async () => {
    const response = await fetch(`${API_END_POINT}/todo-list/${todoListDetail.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });
    const { status, data, error } = await response.json();

    switch (status) {
      case 'success':
        const newData = [...todoList];
        newData.forEach((item, index) => {
          if (item.id == data.id) {
            newData.splice(index, 1);
          }
        })
        setTodoList(newData);
        break;
      case 'error':
        setErrorMessage(error.message);
        setOpenSnackBar(true);
        break;
    }
    setTodoListDetail(undefined);
    setOpenAddDialog(false);
  }

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  }

  const handleOpenDialog = () => {
    setDialogType('create');
    setOpenAddDialog(true);
    setDialogMode('form');
    setDialogTitle('What do you to call it?');
  }

  const handleOpenUpdateDialog = (item) => {
    setDialogType('edit');
    setDialogMode('form');
    setDialogTitle('What do you to call it?');
    setTodoListDetail(item);
    setOpenAddDialog(true);
  }

  const handleOpenDeleteDialog = (item) => {
    setDialogType('delete');
    setDialogTitle('Confirm');
    setDialogMode('confirm');
    setTodoListDetail(item);
    setOpenAddDialog(true);
  }

  const renderList = () => {
    const component = todoList.length > 0 ? (
      <List className={classes.list}>
        {todoList.map(item => {
          return (
            <ListItem key={item.id} role={undefined} button>
              <ListItemText onClick={() => router.push(`/todo-list/${item.id}`)} primary={item.title} />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleOpenUpdateDialog(item)} color="primary" edge="end" aria-label="delete">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleOpenDeleteDialog(item)} edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
      </List>
    ) : (
        <Box mt={2} mb={2}>
          <Alert severity="info">You current don't have any todo list</Alert>
        </Box>
      )

    return component;
  }

  return (
    <Container maxWidth="sm">
      <Head>
        <title>Todo list</title>
      </Head>

      {renderList()}

      <Fab className={classes.fab} color="primary" aria-label="add">
        <AddIcon onClick={handleOpenDialog} />
      </Fab>

      <TodoDialog
        title={dialogTitle}
        placeholder="Title of you list"
        contentText="Are you sure to delete?"
        open={openAddDialog}
        type={dialogType}
        mode={dialogMode}
        handleClose={handleCloseDialog}
        handleAdd={handleAddTodo}
        handleUpdate={handleUpdateTodo}
        handleDelete={handleDeleteTodo}
        category="list"
        detailOfList={todoListDetail}
      />

      {errorMessage &&
        (<Snackbar open={openSnackBar} autoHideDuration={2000} onClose={handleCloseSnackBar}>
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>)}
    </Container>
  );
}

export default withHeader(TodoListPage);

export async function getServerSideProps({ req }) {
  const { cookies } = req;

  const response = await fetch(`${API_END_POINT}/todo-list`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${cookies.token}`,
    }
  });
  const { status, data } = await response.json();

  return {
    props: { status, data },
  }
}
