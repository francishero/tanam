import createPermalink from '@/helpers/createPermalink';

const setTitle = (state, payload) => {
  state.title = payload;
  state.permalink = payload ? createPermalink(payload) : null;
};
const setPlace = (state, payload) => (state.place = payload);
const setDateStart = (state, payload) => (state.dateStart = payload);
const setTimeStart = (state, payload) => (state.timeStart = payload);
const setDateEnd = (state, payload) => (state.dateEnd = payload);
const setTimeEnd = (state, payload) => (state.timeEnd = payload);
const setPriceRegular = (state, payload) => (state.priceRegular = payload);
const setPriceMember = (state, payload) => (state.priceMember = payload);
const setRsvpEmail = (state, payload) => (state.rsvpEmail = payload);
const setRsvpUrl = (state, payload) => (state.rsvpUrl = payload);
const setRsvpFacebook = (state, payload) => (state.rsvpFacebook = payload);
const setFeaturedImage = (state, payload) => (state.featuredImage = payload);
const setPermalink = (state, payload) => (state.permalink = payload);
const setContent = (state, payload) => (state.content = payload);

const setPost = (state, payload) => {
  const keys = Object.keys(payload);
  keys.forEach(key => {
    state[key] = payload[key];
  });
};
const setPostToNull = state => {
  const keys = Object.keys(state);
  keys.forEach(key => {
    state[key] = null;
  });
};

export default {
  setTitle,
  setPlace,
  setDateStart,
  setTimeStart,
  setDateEnd,
  setTimeEnd,
  setPriceRegular,
  setPriceMember,
  setRsvpEmail,
  setRsvpUrl,
  setRsvpFacebook,
  setFeaturedImage,
  setPermalink,
  setContent,
  setPost,
  setPostToNull
};