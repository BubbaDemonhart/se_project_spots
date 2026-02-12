const editProfileBtn = document.querySelector(".profile__edit-button");
const editProfileModel = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModel.querySelector(".modal__close-btn");

const newPostBtn = document.querySelector(".profile__post-button");
const newPostModel = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModel.querySelector(".modal__close-btn");

editProfileBtn.addEventListener("click", function () {
  editProfileModel.classList.add("modal_is-opened");
});

editProfileCloseBtn.addEventListener("click", function () {
  editProfileModel.classList.remove("modal_is-opened");
});

newPostBtn.addEventListener("click", function () {
  newPostModel.classList.add("modal_is-opened");
});

newPostCloseBtn.addEventListener("click", function () {
  newPostModel.classList.remove("modal_is-opened");
});
