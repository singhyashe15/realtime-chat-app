import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groupDetails :  [],
  participantsDetails : []
};

export const groupSlice = createSlice({
  name: 'chat',
  initialState,
  reducers:{
    addGroup : (state , action) => {
      state.groupDetails = action.payload;
    },
    addParticipant : (state , action) => {
      state.participantsDetails = action.payload;
    }
  }
})

export const {addGroup,addParticipant}  = groupSlice.actions;
export default groupSlice.reducer;