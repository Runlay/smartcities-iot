import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { ModeToggle } from '@/components/ModeToggle';
import { Warehouse } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';

interface RouterLinkProps {
  to: string;
  children: React.ReactNode;
}

const RouterLink = ({ to, children }: RouterLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavigationMenuLink asChild data-active={isActive}>
      <NavLink to={to} end>
        {children}
      </NavLink>
    </NavigationMenuLink>
  );
};

const Navbar = () => {
  return (
    <header className='flex items-center justify-between py-6'>
      <div className='flex items-center'>
        <div className='mr-6 flex items-center'>
          <Warehouse className='mr-2'></Warehouse>
          <span className='cursor-default'>SmartStore</span>
        </div>

        <nav>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <RouterLink to='/'>Overview</RouterLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <RouterLink to='/environment-state'>
                  Environment State
                </RouterLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <RouterLink to='/plan-execution'>Plan Execution</RouterLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>

      <ModeToggle />
    </header>
  );
};

export default Navbar;
