import { ActionReducerMap } from '@ngrx/store';
import * as auth from 'src/app/auth/ngrx/reducer/auth.reducer';

export interface AppState {
    user: auth.State;
}

export const appReducers: ActionReducerMap<AppState> = {
    user: auth.authReducer,
}