import { ButtonProps } from '@mui/material/Button';
import { IconButtonProps } from '@mui/material/IconButton';
import React from 'react';

export interface NavLinkProps {
  component?: string | React.FC<any>;
  href: string;
  activeClass?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface AuthComponentProps {
  auth: boolean;
  name?: string;
  profileURL?: string;
}

export interface AppContextProps {
  children: React.ReactNode;
  value: { [key: string]: any };
}

export interface AppContext {
  openLoginModal: boolean;
  openLoginScreen: () => void;
  closeLoginScreen: () => void;
  [key: string]: any;
}

export interface User {
  auth: boolean;
  name?: string;
  profile_url?: string;
}

export interface ClientModalProps {
  children: Readonly<React.ReactNode>;
  className: string;
  open: boolean;
  onClose: () => void;
}

export interface FormSubmitValue {
  seed: any;
  prompt: string;
  negativePrompt: string;
  color: string;
  resolution: string;
  guidance: number;
}

export interface History {
  _id: string;
  image_Id: string;
  createdAt: string;
  height: number;
  width: number;
  negative_prompt: string;
  prompt: string;
  color: string;
  seed: number;
  guidance_scale: number;
}

export interface SaveButtonState {
  isSaved: boolean;
  isDisabled: boolean;
}

export interface SaveButtonProps extends IconButtonProps {
  isSaved: boolean;
}

export interface PageProps {
  params: { page: string; path: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface Feed {
  _id: string;
  image_Id: string;
  username: string;
  profile_img: string;
  width: number;
  height: number;
  isSaved: boolean;
}

export interface UserFeeds {
  feeds: Array<Feed>;
  pages: number;
}

export interface ImageCardProps {
  feed: Feed;
  isDisabled: boolean;
  onSave: (id: string, action: 'add' | 'remove') => void;
}

export interface GalleryProps {
  maxWidth: number;
  feeds: Array<Feed>;
  isUserCollection: boolean;
}

export interface DownloadButtonProps extends ButtonProps {
  fileId: string;
}

export interface GenerateWithSettingsButtonProps extends ButtonProps {
  setting: History;
}

export interface ImageFormSetting {
  prompt: string;
  negativePrompt: string;
  color: string;
  resolution: string;
  guidance: number;
  seed?: number;
}
