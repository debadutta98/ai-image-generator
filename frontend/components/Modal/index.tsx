'use client';

import { ClientModalProps } from '@/types';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { CloseButton } from '../Button';

export default function ClientModal(props: ClientModalProps) {
  return (
    <Modal open={props.open} onClose={props.onClose} className="backdrop-blur-sm overflow-y-auto">
      <Box
        className={`fixed bg-colDark90 opacity-100 p-5 rounded-xl outline-none top-[30%] left-[50%] -translate-x-[50%] -translate-y-[30%] ${props.className || ''}`}
      >
        <CloseButton className="absolute top-4 right-4" onClick={props.onClose} />
        {props.children}
      </Box>
    </Modal>
  );
}
