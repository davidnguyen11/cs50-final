import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from '@material-ui/core';

export function TodoDialog(props: Props) {
  const [inputValue, setInputValue] = useState(undefined);
  const {
    open, title, placeholder,
    handleAdd, handleUpdate, handleDelete,
    handleClose,
    detailOfList, detailOfListItem,
    type, mode,
    category, contentText,
  } = props;

  const onClick = () => {
    const title = (document.getElementById('title') as HTMLInputElement);
    switch (type) {
      case 'edit':
        handleUpdate(title.value);
        console.log('hello');
        setInputValue(undefined);
        break;
      case 'create':
        handleAdd(title.value);
        setInputValue(undefined);
        break;
      case 'delete':
        handleDelete();
        setInputValue(undefined);
        break;
    }
  }

  useEffect(() => {
    let value;
    switch (category) {
      case 'list':
        if (detailOfList) {
          value = detailOfList.title
        }
        break;
      case 'item':
        if (detailOfListItem) {
          value = detailOfListItem.content;
        }
        break;
    }
    setInputValue(value);
  });

  let body;
  switch (mode) {
    case 'form':
      body = (
        <TextField autoComplete="off" fullWidth required id="title" defaultValue={inputValue} placeholder={placeholder} type="text" />
      );
      break;
    case 'confirm':
      body = (
        <>
          <DialogContentText>{contentText}</DialogContentText>
          <DialogContentText>
            <strong>{inputValue}</strong>
          </DialogContentText>
        </>
      );
      break;
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Close</Button>
        <Button onClick={onClick} color="primary" variant="contained" autoFocus>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

type Props = StateProps & DispatchProps;

interface StateProps {
  title?: string;
  open: boolean;
  placeholder?: string;
  contentText?: string;
  type?: 'edit' | 'create' | 'delete';
  category?: 'list' | 'item';
  mode: 'confirm' | 'form';
  detailOfList?: DetailOfList;
  detailOfListItem?: DetailOfListItem;
}

interface DispatchProps {
  handleAdd: (value: string) => void;
  handleUpdate: (value: string) => void;
  handleDelete: () => void;
  handleClose: () => void;
}

interface DetailOfList {
  id: number;
  title: string;
}

interface DetailOfListItem {
  id: number;
  content: string;
}
