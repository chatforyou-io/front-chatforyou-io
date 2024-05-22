'use client';

import { useState } from "react";

export default function Articles() {
	const chatrooms = [
    {
      title: "채팅입니다 1",
      content: "이 곳은 첫번째 채팅입니다."
    },
    {
      title: "채팅입니다 2",
      content: "이 곳은 두번째 채팅입니다."
    },
    {
      title: "채팅입니다 3",
      content: "이 곳은 세번째 채팅입니다."
    } 
  ];
  
  return (
    <div className="p-4">
      {chatrooms.map((chatroom, index) => (
        <div key={index} className="border-b border-gray-400 py-2">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">{chatroom.title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{chatroom.content}</p>
        </div>
      ))}
    </div>
  );
}