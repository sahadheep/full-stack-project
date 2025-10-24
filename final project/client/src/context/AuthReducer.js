export default function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        user: action.payload.user
      };
    case 'LOGOUT':
      return {
        user: null,
        accessToken: null
      };
    case 'REFRESH':
      return {
        ...state,
        accessToken: action.payload.accessToken
      };
    default:
      return state;
  }
}
