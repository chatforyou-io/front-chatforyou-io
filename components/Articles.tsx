'use client';

import { useState } from "react";

export default function Articles() {
	const articles = [
    {
      title: "게시글 1",
      content: "이것은 첫번째 게시글입니다.",
    },
    {
      title: "게시글 2",
      content: "이것은 두번째 게시글입니다.",
    },
    {
      title: "게시글 3",
      content: "이것은 세번째 게시글입니다.",
    },
  ];
  
  return (
    <div className="p-4">
      {articles.map((article, index) => (
        <div key={index} className="border-b border-gray-400 py-2">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">{article.title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{article.content}</p>
        </div>
      ))}
    </div>
  );
}