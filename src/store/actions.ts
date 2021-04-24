export enum ActionTypes {

}

export interface IAction {
    payload?: any;
    type: ActionTypes;
}

