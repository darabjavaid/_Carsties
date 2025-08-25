import { create } from "zustand";

type State ={
    pageNumber: number;
    pageSize: number;
    pageCount: number;
    searchTerm: string;
    orderBy: string;
    filterBy: string;
}

type Actions = {
    setParams: (params: Partial<State>) => void; //Partial because we may not want to update all params at once
    reset: () => void; //reset to initial state
}

//initial state
const initialState: State = {
    pageNumber: 1,
    pageSize: 12,
    pageCount: 0,
    searchTerm: '',
    orderBy: 'make',
    filterBy: 'live'
}

export const useParamsStore = create<State & Actions>((set) => ({ //combine state and actions
    ...initialState,
    
    setParams: (newParams: Partial<State>) => { //only partial params will be passed
        set((state) => { 
            if(newParams.pageNumber){
                return { ...state, pageNumber: newParams.pageNumber } //if only page number is changing, then keep other params same
            }else{
                return { ...state, ...newParams, pageNumber: 1 } //reset page number to 1 if any other param changes
            }
        })
    },
    reset: () => set(initialState) //reset to initial state
}));