'use client';
import Image from 'next/image';
import { SaveImageButton } from '../Button';
import { ImageCardProps } from '@/types';
import { useState } from 'react';
import Link from 'next/link';
import { getWindow } from '@/utils';

const ImageCard: React.FC<ImageCardProps> = (props) => {
  const [disabled, setDisabled] = useState<boolean>(props.isDisabled);
  let status: number;
  const onClickHandler = async () => {
    setDisabled(true);
    await fetch(`/api/user/image/${props.feed.isSaved ? 'remove' : 'add'}`, {
      method: props.feed.isSaved ? 'DELETE' : 'POST',
      body: JSON.stringify({
        imageId: props.feed._id
      }),
      credentials: 'include'
    })
      .then(async (res) => {
        status = res.status;
        return await res.json();
      })
      .then(() => {
        if (status === 200) {
          props.onSave(props.feed._id, !props.feed.isSaved ? 'add' : 'remove');
        }
      })
      .finally(() => {
        setDisabled(false);
      });
  };
  const window = getWindow();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex-shrink-0 flex-grow-0 border-[5px] border-colDark80 self-start rounded-lg">
        <Link key={props.feed._id} href={`${window?.location.pathname}/${props.feed._id}`}>
          <Image
            src={`/api/image/${props.feed.image_Id}`}
            width={props.feed.width}
            height={props.feed.height}
            alt="image"
            className="rounded-lg h-auto"
          />
        </Link>
      </div>
      <div className="text-colWhite80 flex">
        <div className="flex items-center gap-3">
          <Image
            src={props.feed.profile_img}
            width={35}
            height={35}
            alt="user"
            className="rounded-[50%] object-cover"
          />
          <span className="capitalize font-[400]">{props.feed.username}</span>
        </div>
        <SaveImageButton
          className="p-2 rounded-lg ml-auto"
          isSaved={props.feed.isSaved}
          onClick={onClickHandler}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default ImageCard;
