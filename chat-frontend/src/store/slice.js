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
    },
    removeMemberFromGroup : (state , action) => {
      state.groupDetails.map((prev) => {
        // if(prev?.id === action.payload.id){
        //   return {
        //     ...prev , 
        //   }
        // }
      })
    }
  }
})

export const {addGroup,addParticipant,removeMemberFromGroup}  = groupSlice.actions;
export default groupSlice.reducer;