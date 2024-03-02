import { createSlice } from '@reduxjs/toolkit'

export const cardSlice = createSlice({
  name: 'card',
  initialState: [
  ],
  reducers: {
       getCards:(state) =>{

           let cardArray = [{name:"Cat card",logo:"/images/CatCard.jpeg"},{name:"Defuse card",logo:"/images/DefuseCard.jpeg"},{name:"Shuffle card" ,logo:"/images/ShuffleCard.jpeg"},{name:"Exploding kitten card",logo:"/images/ExplodingCard.jpeg"}]

           for(let i=0;i<5;i++){
              const card = cardArray[Math.floor(Math.random()*4)]
              state.push(card);
           }
       },
       emptyCards:(state) =>{
        state = state.splice(0,state.length);
       },
       remove:(state,action) =>{
            console.log(action.payload,state.length);
             state = state.splice(action.payload,1);

       }
  },
})

// Action creators are generated for each case reducer function
export const { getCards,emptyCards,remove} = cardSlice.actions;

export default cardSlice.reducer;