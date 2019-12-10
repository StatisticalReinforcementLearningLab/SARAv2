import { Action } from '@ngrx/store'
import { UserData } from './userdata.model'
import * as UserDataActions from './userdata.actions'

// Section 1
const initialState: UserData = {
    name: 'Initial Tutorial',
    url: 'http://google.com',
    points: 100
}

// Section 2
export function reducer(state: UserData[] = [initialState], action: UserDataActions.Actions) {

    // Section 3
    switch(action.type) {
        /*
        case UserDataActions.ADD_MONEY:
            return [...state, action.payload];
        case UserDataActions.ADD_MONEY:
            return [...state, action.payload];
        default:
            return state;
        */
    }
}