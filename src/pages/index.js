import "./index.css";
import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
  setInitialFormState,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f5f4832d-b4d5-41e6-9add-31a36d7a4191",
    "Content-Type": "application/json",
  },
});

const profileAvatarEl = document.querySelector(".profile__avatar");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const cardList = document.querySelector(".cards__list");
let currentUserId = null;

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    currentUserId = userInfo._id || userInfo.id;
    profileAvatarEl.src = userInfo.avatar;
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardList.append(cardElement);
    });
  })
  .catch(console.error);

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  function handlelike(evt, id) {
    const likeButton = evt.target;
    const isLiked = likeButton.classList.contains("card__like-btn_active");

    api
      .changeLike(id, isLiked)
      .then(() => {
        likeButton.classList.toggle("card__like-btn_active");
      })
      .catch(console.error);
  }

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardId = data._id || data.id;
  const cardIsLiked = data.isLiked;
  if (cardIsLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

  cardLikeBtnEl.addEventListener("click", (evt) => {
    handlelike(evt, cardId);
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      if (selectedCard && selectedCard.parentNode) {
        selectedCard.remove();
      }
      closeModal(deleteModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error)
    .finally(() => restoreButtonText(submitBtn));
}

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const newPostBtn = document.querySelector(".profile__post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const avatarModel = document.querySelector("#edit-avatar-modal");
const avatarForm = avatarModel.querySelector(".modal__form");
const avatarModelBtn = document.querySelector(".profile__avatar-btn");
const avatarInput = avatarModel.querySelector("#profile-avatar-input");

const editProfileForm = editProfileModal.querySelector(".modal__form");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
if (deleteForm) {
  deleteForm.addEventListener("submit", handleDeleteSubmit);
}

const deleteCancelBtn = deleteModal.querySelector(
  'button[type="button"].modal__submit-btn',
);
if (deleteCancelBtn) {
  deleteCancelBtn.addEventListener("click", (evt) => {
    setButtonText(deleteCancelBtn, "Canceling...");
    closeModal(deleteModal);
    restoreButtonText(deleteCancelBtn);
  });
}

let selectedCard, selectedCardId;

const newPostForm = document.querySelector("#new-post-form");
const newPostImageLink = newPostForm.querySelector("#card-image-input");
const newPostCaption = newPostForm.querySelector("#card-caption-input");

const previewModal = document.querySelector("#preview-modal");
const cardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

function setButtonText(button, text) {
  if (!button) return;
  if (button.dataset.originalText === undefined) {
    button.dataset.originalText = button.textContent;
  }
  button.textContent = text;
}

function restoreButtonText(button) {
  if (!button) return;
  const orig =
    button.dataset.originalText !== undefined
      ? button.dataset.originalText
      : "Save";
  button.textContent = orig;
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  window.addEventListener("keydown", handleEscape);
  window.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  window.removeEventListener("keydown", handleEscape);
  window.removeEventListener("click", handleOverlayClick);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, "Saving...");
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      avatarForm.reset();
      closeModal(avatarModel);
    })
    .catch(console.error)
    .finally(() => restoreButtonText(submitBtn));
}

editProfileBtn.addEventListener("click", function (evt) {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    validationConfig,
  );
  openModal(editProfileModal);
});

const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

newPostBtn.addEventListener("click", function () {
  newPostImageLink.value = "";
  newPostCaption.value = "";
  resetValidation(
    newPostForm,
    [newPostImageLink, newPostCaption],
    validationConfig,
  );
  setInitialFormState(newPostForm, validationConfig);
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

avatarModelBtn.addEventListener("click", function () {
  openModal(avatarModel);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, "Saving...");
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      if (data.avatar) {
        profileAvatarEl.src = data.avatar;
      }
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => restoreButtonText(submitBtn));
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, "Saving...");

  const inputValues = {
    name: newPostCaption.value,
    link: newPostImageLink.value,
  };
  api
    .createCard(inputValues)
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardList.prepend(cardElement);
      newPostForm.reset();
      disableButton(cardSubmitBtn, validationConfig);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => restoreButtonText(submitBtn));
}

newPostForm.addEventListener("submit", handleNewPostSubmit);

enableValidation(validationConfig);
