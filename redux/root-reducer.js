import { combineReducers } from 'redux';
import Auth from '../authentication/reducer';
import App from '@iso/redux/app/reducer';
import Calendar from '@iso/redux/calendar/reducer';
import Box from '@iso/redux/box/reducer';
import ThemeSwitcher from '@iso/redux/themeSwitcher/reducer';
import LanguageSwitcher from '@iso/redux/languageSwitcher/reducer';
import drawer from '@iso/redux/drawer/reducer';
import modal from '@iso/redux/modal/reducer';
import profile from '@iso/redux/profile/reducer';

export default combineReducers({
  App,
  ThemeSwitcher,
  LanguageSwitcher,
  modal,
  profile,
});
