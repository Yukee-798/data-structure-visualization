import { IAction } from "./actions";



export interface IState {

}

const initState: IState = {

}

export default function reducer(state: IState = initState, action: IAction) {
    const {payload, type} = action;

    switch(type) {
        default:
            return state;
    }
}