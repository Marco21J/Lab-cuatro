import { createReducer, on } from '@ngrx/store';
import { ILoginResponse } from '../../models/interfaces/login-response.interface';
import { setUser, unsetUser } from '../action/auth.actions';

export interface State {
    user: ILoginResponse | null;
}

export const initialState: State = {
    user: null,
}

const _authReducer = createReducer(
    initialState,
    on(setUser, (state, { usuario }) => ({ ...state, user: { ...usuario } })),
    on(unsetUser, state => ({ ...state, user: null }))
);

export function authReducer(state: any, action: any) {
    return _authReducer(state, action);
}