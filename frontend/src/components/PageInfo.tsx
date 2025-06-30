interface PageInfoProps {
  heading: string;
  text: string;
}

const PageInfo = ({ heading, text }: PageInfoProps) => {
  return (
    <div className='mb-8'>
      <h1 className='mb-2 text-2xl font-bold'>{heading}</h1>
      <p className='text-muted-foreground'>{text}</p>
    </div>
  );
};

export default PageInfo;
