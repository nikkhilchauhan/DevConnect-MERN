import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  ADD_EXP,
  DELETE_EXP,
  ADD_EDU,
  DELETE_EDU,
} from '../actions/types';

const intialState = {
  profile: null, // current user profile
  profiles: [], // for profile listing page
  loading: true,
  error: {},
};
export default function (state = intialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
    case ADD_EXP:
    case ADD_EDU:
    case DELETE_EXP:
    case DELETE_EDU:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };
    default:
      return state;
  }
}
