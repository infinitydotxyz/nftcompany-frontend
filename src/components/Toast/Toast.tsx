import React from 'react';
import { ToastContainer, toast, ToastContent } from 'react-toastify';

export const Toast = () => {
  return <ToastContainer position="bottom-right" />;
};

export const infoToast = (msg: ToastContent) => {
  toast.info(msg, { position: 'bottom-center' });
};

export const errorToast = (msg: ToastContent) => {
  toast.error(msg, { position: 'bottom-center' });
};
