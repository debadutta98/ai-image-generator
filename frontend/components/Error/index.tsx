'use client';
import React from 'react';

export default function Error(props: { children: React.ReactNode }) {
  return (
    <div className="border-[5px] border-colPurple text-colWhite80 flex flex-col gap-5 p-5 rounded-lg text-lg mx-auto mt-[10%] w-10/12 sm:w-[450px] shadow-lg">
      {props.children}
    </div>
  );
}
