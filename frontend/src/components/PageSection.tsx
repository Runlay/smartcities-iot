import React from 'react';

interface PageSectionProps {
  title?: string;
  children: React.ReactNode;
}

const PageSection = ({ title, children }: PageSectionProps) => {
  return (
    <section className='py-4'>
      {title && <h2 className='text-xl font-semibold mb-4'>{title}</h2>}

      {children}
    </section>
  );
};

export default PageSection;
