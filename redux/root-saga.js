import { all } from 'redux-saga/effects';
// import authSagas from '../authentication/sagas';
import cardsSagas from '@iso/redux/card/saga';
import profileSaga from '@iso/redux/profile/saga';

export default function* rootSaga(getState) {
  yield all([
    // authSagas(),
    cardsSagas(),
    profileSaga(),
  ]);
}
