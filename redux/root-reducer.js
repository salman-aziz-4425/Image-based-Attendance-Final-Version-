import { combineReducers } from 'redux';
import Auth from '../authentication/reducer';
import App from '@iso/redux/app/reducer';
import ThemeSwitcher from '@iso/redux/themeSwitcher/reducer';
import modal from '@iso/redux/modal/reducer';
import profile from '@iso/redux/profile/reducer';

export default combineReducers({
  App,
  ThemeSwitcher,
  modal,
  profile,
});
