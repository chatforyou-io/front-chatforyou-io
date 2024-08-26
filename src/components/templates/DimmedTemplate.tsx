import React, { ReactNode } from 'react';
import Header from '@/src/components/Header';

interface DimmedTemplateProps {
  children: ReactNode;
}

const DimmedTemplate: React.FC<DimmedTemplateProps> = ({ children }) => {
  return (
    <main className="w-full h-full bg-gray-200">
      <Header />
      <div className="pt-20 w-full h-full">
        {children}
      </div>
    </main>
  );
};

export default DimmedTemplate;