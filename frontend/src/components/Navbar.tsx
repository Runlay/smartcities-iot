import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Cog, FileText, Home, List, Warehouse } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';
import { ModeToggle } from './ModeToggle';

interface NavMenuLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavMenuLink = ({ to, children }: NavMenuLinkProps) => {
  const location = useLocation();

  return (
    <NavigationMenuLink asChild data-active={location.pathname === to}>
      <NavLink to={to}>{children}</NavLink>
    </NavigationMenuLink>
  );
};

const Navbar = () => {
  return (
    <header className='flex items-center justify-between px-4 py-6'>
      <div>
        <div className='flex items-center gap-2'>
          <Warehouse />
          <h1>SmartStore</h1>
        </div>
      </div>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavMenuLink to='/'>
              <div className='flex items-center gap-2'>
                <Home className='text-foreground h-5 w-5' />
                <span>Dashboard</span>
              </div>
            </NavMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavMenuLink to='/configuration'>
              <div className='flex items-center gap-2'>
                <Cog className='text-foreground h-5 w-5' />
                <span>Configuration</span>
              </div>
            </NavMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavMenuLink to='/plan-execution'>
              <div className='flex items-center gap-2'>
                <List className='text-foreground h-5 w-5' />
                <span>Plan Execution</span>
              </div>
            </NavMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavMenuLink to='/raw-data'>
              <div className='flex items-center gap-2'>
                <FileText className='text-foreground h-5 w-5' />
                <span>Raw Data</span>
              </div>
            </NavMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <ModeToggle />
    </header>
  );
};

export default Navbar;
