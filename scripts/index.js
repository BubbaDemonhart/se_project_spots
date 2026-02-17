const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModel = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModel.querySelector(".modal__close-btn");
const editProfileNameInput = editProfileModel.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModel.querySelector(
  "#profile-description-input",
);

const newPostBtn = document.querySelector(".profile__post-btn");
const newPostModel = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModel.querySelector(".modal__close-btn");

const editProfileForm = editProfileModel.querySelector(".modal__form");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const newPostForm = newPostModel.querySelector(".modal__form");
const newPostImageLink = document.querySelector("#card-image-input");
const newPostCaption = document.querySelector("#card-caption-input");

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
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

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  editProfileModel.classList.remove("modal_is-opened");
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  console.log(newPostImageLink.value);
  console.log(newPostCaption.value);
  newPostModel.classList.remove("modal_is-opened");
}

newPostForm.addEventListener("submit", handleNewPostSubmit);
