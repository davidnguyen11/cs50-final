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
  Checkbox,
  ListItemIcon,
  Typography,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack,
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { useAuthState } from '../../contexts/auth';
import { TodoDialog } from '../../components/Dialog';
import { API_END_POINT } from '../../utils/constants';
import { useRouter } from 'next/router'
import Link from 'next/link';

const useStyles = makeStyles((theme) => ({
  fabAdd: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabBack: {
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
  },
  listTitleIcon: {
    'margin-right': theme.spacing(1),
  },
  list: {
    width: '100%',
  },
}));

export default function DetailtodoListItemsPage(props) {
  const router = useRouter()
  const { id: todoListItemsId } = router.query;
  const { status, data } = props;
  const [todoListItems = [], setTodoListItems] = useState([]);
  const [todoListTitle, setTodoListTitle] = useState(undefined);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [todoListItemDetail, setTodoListItemDetail] = useState(undefined);
  const [dialogType, setDialogType] = useState(undefined);
  const [dialogMode, setDialogMode] = useState(undefined);
  const [dialogTitle, setDialogTitle] = useState(undefined);
  const { token } = useAuthState();
  const classes = useStyles();

  useEffect(() => {
    switch (status) {
      case 'success':
        const { list, items } = data;
        setTodoListItems(items);
        setTodoListTitle(list);
        break;
    }
  }, []);

  const handleCloseDialog = () => {
    setTodoListItemDetail(undefined);
    setOpenAddDialog(false);
  }

  const handleAddTodo = async (content: string) => {
    const response = await fetch(`${API_END_POINT}/${todoListItemsId}/todo-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    const { status, data, error } = await response.json();

    switch (status) {
      case 'success':
        console.log(todoListItems);
        const newData = [data].concat(...todoListItems);
        setTodoListItems(newData);
        break;
      case 'error':
        setErrorMessage(error.message);
        setOpenSnackBar(true);
        break;
    }
    setOpenAddDialog(false);
  }

  const handleUpdateTodoItem = async (content: string) => {
    const response = await fetch(`${API_END_POINT}/${todoListItemsId}/todo-item/${todoListItemDetail.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    const { status, data, error } = await response.json();

    switch (status) {
      case 'success':
        const newData = [...todoListItems];
        newData.forEach(item => {
          if (item.id === data.id) {
            item.content = data.content;
          }
        })
        setTodoListItems(newData);
        break;
      case 'error':
        setErrorMessage(error.message);
        setOpenSnackBar(true);
        break;
    }
    setTodoListItemDetail(undefined);
    setOpenAddDialog(false);
  }

  const handleDeleteTodoItem = async () => {
    const response = await fetch(`${API_END_POINT}/${todoListItemsId}/todo-item/${todoListItemDetail.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });
    const { status, data, error } = await response.json();

    switch (status) {
      case 'success':
        const newData = [...todoListItems];
        newData.forEach((item, index) => {
          if (item.id === data.id) {
            newData.splice(index, 1);
          }
        })
        setTodoListItems(newData);
        break;
      case 'error':
        setErrorMessage(error.message);
        setOpenSnackBar(true);
        break;
    }
    setTodoListItemDetail(undefined);
    setOpenAddDialog(false);
  }

  const handleCompleteTodoItem = async (item) => {
    const statusOfItem = item.is_done ? 'not-done' : 'done';

    const response = await fetch(`${API_END_POINT}/${todoListItemsId}/todo-item/${item.id}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: statusOfItem }),
    });
    const { status, data, error } = await response.json();

    switch (status) {
      case 'success':
        const newData = [...todoListItems];
        newData.forEach(item => {
          if (item.id === data.id) {
            item.is_done = data.is_done;
          }
        });

        setTodoListItems(newData);
        break;
      case 'error':
        setErrorMessage(error.message);
        setOpenSnackBar(true);
        break;
    }
  }

  // UI
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
    setTodoListItemDetail(item);
    setOpenAddDialog(true);
  }

  const handleOpenDeleteDialog = (item) => {
    setDialogType('delete');
    setDialogTitle('Confirm');
    setDialogMode('confirm');
    setTodoListItemDetail(item);
    setOpenAddDialog(true);
  }

  const renderList = () => {
    return todoListTitle && (
      <Box mb={1}>
        <Typography variant="h5">{todoListTitle.title}</Typography>
      </Box>
    );
  }

  const renderListItems = () => {
    const component = (todoListItems && todoListItems.length > 0) ? (
      <List className={classes.list}>
        {todoListItems.map(item => {
          return (
            <ListItem key={item.id} role={undefined} button>
              <ListItemIcon>
                <Checkbox
                  onClick={() => handleCompleteTodoItem(item)}
                  edge="start"
                  tabIndex={-1}
                  checked={item.is_done}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={item.content} />
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
          <Alert severity="info">What would you like to do?</Alert>
        </Box>
      )

    return component;
  }

  return (
    <Container maxWidth="sm">
      <Head>
        <title>List items</title>
      </Head>

      <Box mt={2} mb={2}>
        <Fab color="default" aria-label="add">
          <Link href="/todo-list">
            <ArrowBack />
          </Link>
        </Fab>
      </Box>


      {renderList()}

      {renderListItems()}

      <Fab className={classes.fabAdd} color="primary" aria-label="add">
        <AddIcon onClick={handleOpenDialog} />
      </Fab>

      <TodoDialog
        title={dialogTitle}
        placeholder="What do you want to do?"
        contentText="Are you sure to delete?"
        open={openAddDialog}
        type={dialogType}
        mode={dialogMode}
        handleClose={handleCloseDialog}
        handleAdd={handleAddTodo}
        handleUpdate={handleUpdateTodoItem}
        handleDelete={handleDeleteTodoItem}
        category="item"
        detailOfListItem={todoListItemDetail}
      />

      {errorMessage &&
        (<Snackbar open={openSnackBar} autoHideDuration={2000} onClose={handleCloseSnackBar}>
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>)}
    </Container>
  );
}

export async function getServerSideProps({ req, params }) {
  const { cookies } = req;
  const { id: todoListId } = params;

  const response = await fetch(`${API_END_POINT}/${todoListId}/todo-items`, {
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
