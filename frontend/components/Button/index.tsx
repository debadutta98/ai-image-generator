'use client';
import { useAppContext } from '@/context';
import Button from '@mui/material/Button';
import { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import React, { HTMLProps } from 'react';
import Pagination, { PaginationProps } from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import { DownloadButtonProps, GenerateWithSettingsButtonProps, SaveButtonProps } from '@/types';
import { downloadImage } from '@/utils';
import { useRouter } from 'next/navigation';

export const SignOutButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: '#212936',
  color: '#E4E4E7',
  '&:hover': {
    backgroundColor: '#394150'
  }
}));

export const GenerateImageButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: '#212936',
  color: '#E4E4E7',
  textTransform: 'capitalize',
  '&.active': {
    backgroundColor: '#7C71FF'
  }
}));

export const NavProfileButton: React.FC<HTMLProps<HTMLButtonElement>> = (props) => {
  const context = useAppContext();
  const onClickHandler = () => {
    if (!context.auth) {
      context.openLoginScreen();
    }
  };
  return (
    <div
      className="mt-auto relative pb-2 px-2 auth-profile cursor-pointer"
      onClick={onClickHandler}
    >
      {props.children}
    </div>
  );
};

export const LoginButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: '#7C71FF',
  textTransform: 'initial',
  color: '#E4E4E7'
}));

export const CloseButton: React.FC<HTMLProps<HTMLButtonElement>> = (props) => {
  let defaultClass = 'bg-colDark80 rounded-lg p-2 max-w-fit cursor-pointer z-[1000]';
  if (props.className) {
    defaultClass += ' ' + props.className;
  }
  return (
    <button className={defaultClass} onClick={props.onClick}>
      <Image
        src="/assets/Close-1.svg"
        alt="profile image"
        className="rounded-[50%] object-cover"
        width={30}
        height={30}
      />
    </button>
  );
};

export const PagesButton: React.FC<PaginationProps> = (props) => {
  return (
    <Pagination
      {...props}
      sx={{
        '& .MuiPaginationItem-root': {
          color: '#E4E4E7',
          cursor: 'pointer',
          '&.MuiPaginationItem-page:hover': {
            backgroundColor: '#7c71ff',
            color: '#E4E4E7'
          },
          '&.Mui-selected': {
            backgroundColor: '#7c71ff',
            color: '#E4E4E7'
          }
        }
      }}
    />
  );
};

export const SaveImageButton: React.FC<SaveButtonProps> = ({ isSaved, ...props }) => {
  return (
    <IconButton
      {...props}
      sx={{
        backgroundColor: isSaved ? '#7C71FF' : '#212936',
        color: '#E4E4E7',
        '&:hover': {
          backgroundColor: isSaved ? '#7C71FF' : '#212936'
        },
        '&.Mui-disabled': {
          backgroundColor: isSaved ? '#7C71FF' : '#212936'
        }
      }}
    >
      <Image src={'/assets/bookmark.svg'} width={22} height={22} alt="save icon" />
    </IconButton>
  );
};

export const DownloadButton: React.FC<DownloadButtonProps> = ({ fileId, ...props }) => {
  return (
    <Button {...props} onClick={downloadImage.bind(null, `/api/image/${fileId}`, fileId)}>
      Download
    </Button>
  );
};

export const GenerateWithSettingsButton: React.FC<GenerateWithSettingsButtonProps> = ({
  setting,
  ...props
}) => {
  const router = useRouter();
  const onClickHandler = () => {
    sessionStorage.setItem('imageSettings', JSON.stringify(setting));
    router.push('/');
  };
  return (
    <Button
      {...props}
      onClick={onClickHandler}
      sx={{
        backgroundColor: '#7C71FF',
        color: '#E4E4E7',
        textTransform: 'none'
      }}
    >
      Generate with this settings
    </Button>
  );
};
