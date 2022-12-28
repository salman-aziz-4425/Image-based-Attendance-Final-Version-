import React from 'react';
import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import themes from '@iso/config/theme/theme.config';
import useWindowSize from '@iso/lib/hooks/useWindowSize';
import appActions from '@iso/redux/app/actions';

const { toggleAll } = appActions;
export default function AppProvider({ children }) {
  const dispatch = useDispatch();
  const { themeName } = useSelector(state => state.ThemeSwitcher.changeThemes);
  const { width, height } = useWindowSize();

  React.useEffect(() => {
    dispatch(toggleAll(width, height));
  }, [dispatch]);
  return (
    <ConfigProvider 
    >
      <IntlProvider
      >
        <ThemeProvider theme={themes[themeName]}>{children}</ThemeProvider>
      </IntlProvider>
    </ConfigProvider>
  );
}
