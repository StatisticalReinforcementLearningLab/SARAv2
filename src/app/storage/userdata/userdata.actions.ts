// Section 1
import { Injectable } from '@angular/core'
import { Action } from '@ngrx/store'
import { UserData } from './userdata.model'


// Section 2
export const ADD_POINT    = '[POINT] Add'
export const ADD_MONEY    = '[Money] Add'

// Section 3
export class AddPoints implements Action {
    readonly type = ADD_POINT

    constructor(public payload: UserData) {}
}

export class AddMoney implements Action {
    readonly type = ADD_MONEY

    constructor(public payload: number) {}
}

// Section 4
export type Actions = AddPoints | AddMoney