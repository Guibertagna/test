import { createSlice } from '@reduxjs/toolkit';

export const numbersSlice = createSlice({
  name: 'numbers',
  initialState: {
    isLoading: false,
    isError: false,
    items: [],
  },
  reducers: {
    updateNumber: (state, action) => {
      const updatedNumber = action.payload;
      state.items = state.items.map(number =>
        number.id === updatedNumber.id ? updatedNumber : number
      );
    },
    setNumbersSucces: (state, action) => {
      state.isError = false;
      state.isLoading = false;
      state.items = action.payload || [];
    },
    setNumbersLoading: (state) => {
      state.isError = false;
      state.isLoading = true;
    },
    setNumbersError: (state) => {
      state.isError = true;
      state.isLoading = false;
    },
  },
});

const { setNumbersSucces, setNumbersError, setNumbersLoading, updateNumber } = numbersSlice.actions;

export const retriveNumbers = () => (dispatch) => {
  dispatch(setNumbersLoading());

  setTimeout(() => {
    fetch('http://localhost:5000/numbers')
      .then(response => response.json())
      .then(payload => {
        dispatch(setNumbersSucces(payload));
      })
      .catch(() => dispatch(setNumbersError()));
  }, 2000);
};

export const updateNumberAction = (updatedNumber) => (dispatch, getState) => {
  dispatch(setNumbersLoading());

  fetch(`http://localhost:5000/numbers/${updatedNumber.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedNumber),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update number');
      }
      return response.json();
    })
    .then(updatedNumberFromServer => {
      setTimeout(() => {
        const updatedNumbers = getState().numbersSlice.items.map(number =>
          number.id === updatedNumberFromServer.id ? updatedNumberFromServer : number
        );
        dispatch(setNumbersSucces(updatedNumbers));
      }, 2000);
    })
    .catch(() => dispatch(setNumbersError()));
};

export const addNumber = (newNumber) => (dispatch, getState) => {
  dispatch(setNumbersLoading());

  const currentNumbers = getState().numbersSlice.items;
  let nextId = currentNumbers.length > 0
    ? Math.max(...currentNumbers.map(number => number.id)) + 1
    : 1;

  const numberWithId = { ...newNumber, id: nextId };

  setTimeout(() => {
    fetch('http://localhost:5000/numbers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(numberWithId),
    })
      .then(response => response.json())
      .then(addedNumber => {
        const updatedNumbers = [...currentNumbers, addedNumber];
        dispatch(setNumbersSucces(updatedNumbers));
      })
      .catch(() => dispatch(setNumbersError()));
  }, 2000);
};

export const deleteNumber = (id) => (dispatch, getState) => {
  const currentNumbers = [...getState().numbersSlice.items];
  dispatch(setNumbersLoading());

  setTimeout(() => {
    fetch(`http://localhost:5000/numbers/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete number');
        }
        const updatedNumbers = currentNumbers.filter(number => number.id !== id);
        dispatch(setNumbersSucces(updatedNumbers));
      })
      .catch(() => dispatch(setNumbersError()));
  }, 2000);
};

export default numbersSlice.reducer;
