import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/store/theme-provider';
import { Outlet } from 'react-router';

const RootLayout = () => {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='max-w-[90rem] mx-auto px-8'>
        <Navbar />

        <main className='px-4'>
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default RootLayout;
