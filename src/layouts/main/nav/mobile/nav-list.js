import Collapse from '@mui/material/Collapse';
import { listClasses } from '@mui/material/List';
import { listItemButtonClasses } from '@mui/material/ListItemButton';
import { listItemTextClasses } from '@mui/material/ListItemText';
import PropTypes from 'prop-types'; // @mui
// components
import { NavSectionVertical } from 'src/components/nav-section';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { usePathname } from 'src/routes/hook';

//
import NavItem from './nav-item';

// ----------------------------------------------------------------------

export default function NavList({ item }) {
  const pathname = usePathname();

  const { path, children } = item;

  const externalLink = path.includes('http');

  const nav = useBoolean();

  return (
    <>
      <NavItem
        item={item}
        open={nav.value}
        onClick={nav.onToggle}
        active={pathname === path}
        externalLink={externalLink}
      />

      {!!children && (
        <Collapse in={nav.value} unmountOnExit>
          <NavSectionVertical
            data={children}
            sx={{
              [`& .${listClasses.root}`]: {
                '&:last-of-type': {
                  [`& .${listItemButtonClasses.root}`]: {
                    height: 160,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    bgcolor: 'background.neutral',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: 'url(/assets/illustrations/illustration_dashboard.png)',
                    [`& .${listItemTextClasses.root}`]: {
                      display: 'none',
                    },
                  },
                },
              },
            }}
          />
        </Collapse>
      )}
    </>
  );
}

NavList.propTypes = {
  item: PropTypes.object,
};
