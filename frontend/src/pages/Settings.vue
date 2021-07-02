<template>
  <div class="settings">
    <div class="bg-white main-shadow pa-sm br-md full-height main-edit-container column">
      <div class="row items-center justify-around full-width edit-container">
        <div class="column items-center avatar-container">
          <Avatar size="200px" :userPic="previewImage" class="mb-sm" />
          <label for="profilePic" class="row items-center justify-center">
            <span>Modifier ma photo de profil</span>
          </label>
          <input
            id="profilePic"
            ref="profilPicInput"
            name="profilePic"
            type="file"
            class="input-file"
            accept="image/*"
            @input="pickFile"
          />
          <button class="change-password br-xs text-caption font-12" @click="showModal = true">Redimensionner</button>
        </div>
        <Dialog
          :showModal="showModal"
          @close="showModal = false"
          :customFooterClass="'row justify-center'"
          :customHeaderClass="'mb-sm'"
        >
          <template v-slot:header>
            <div class="column justify-center">
              <button @click="showModal = false" class="close-button-modal self-end row items-center justify-center">
                <span class="material-icons-round text-primary">close</span>
              </button>
            </div>
          </template>
          <template v-slot:body>
            <cropper
              ref="cropper"
              class="cropper"
              :src="previewImage"
              :auto-zoom="true"
              :stencil-size="{
                width: 200,
                height: 200,
              }"
              image-restriction="stencil"
            ></cropper>
          </template>
          <template v-slot:footer>
            <button @click="cropImage" class="save-button bg-secondary text-white br-sm my-sm font-14">
              Choisir cette image
            </button>
          </template>
        </Dialog>

        <div v-if="editedUser" class="column items-center edit-form">
          <form class="column items-center full-width" @submit.prevent="onSaveProfile">
            <InputField
              @onInput="(val) => (editedUser.firstname = val)"
              :value="editedUser.firstname"
              placeholder="Prénom"
              borderRadius="8px"
              :maxLength="40"
              class="edit-input mb-lg"
              fontSize="16px"
              required
            />
            <InputField
              @onInput="(val) => (editedUser.lastname = val)"
              :value="editedUser.lastname"
              placeholder="Nom"
              borderRadius="8px"
              :maxLength="40"
              class="edit-input mb-lg"
              fontSize="16px"
              required
            />
            <InputField
              @onInput="(val) => (editedUser.job = val)"
              :value="editedUser.job"
              placeholder="Job"
              borderRadius="8px"
              :maxLength="60"
              class="edit-input mb-lg"
              fontSize="16px"
            />
            <InputField
              type="email"
              @onInput="(val) => (editedUser.email = val)"
              :value="editedUser.email"
              placeholder="Mail"
              borderRadius="8px"
              :maxLength="100"
              class="edit-input mb-lg"
              fontSize="16px"
              required
              disabled
            />
            <InputField
              v-if="editPassword"
              type="password"
              @onInput="(val) => (editedPassword = val)"
              :value="editedPassword"
              placeholder="Nouveau mot de passe"
              borderRadius="8px"
              :minLength="8"
              :maxLength="50"
              class="edit-input mb-lg"
              fontSize="16px"
              required
            />
            <InputField
              v-if="editPassword"
              type="password"
              @onInput="(val) => (editedPasswordCopy = val)"
              :value="editedPasswordCopy"
              placeholder="Répetez le nouveau mot de passe"
              borderRadius="8px"
              :minLength="8"
              :maxLength="50"
              class="edit-input mb-lg"
              fontSize="16px"
              required
            />
            <div class="change-password br-xs text-caption self-end font-12" @click="onEditPassword">
              {{ editPassword ? 'Ne pas modifier mon mot de passe' : 'Modifier mon mot de passe' }}
            </div>
            <input
              type="submit"
              value="Sauvegarder"
              class="save-button bg-secondary text-white br-sm my-md font-16"
              :disabled="!editUserIsFill"
            />
          </form>
        </div>
      </div>
      <button @click="logout" class="logout-button self-center text-caption br-xs">Se deconnecter</button>
      <button @click="showDeleteModal = true" class="delete-user-button self-end font-10 text-caption br-xs">
        Supprimer mon compte
      </button>
    </div>
    <Dialog :showModal="showDeleteModal" @close="showDeleteModal = false" :customFooterClass="'row justify-center'">
      <template v-slot:body>
        <div class="column items-start justify-center my-md">
          <span class="text-main font-14"> Voulez-vous vraiment supprimer définitivement votre compte ? </span>
          <span class="text-caption font-12">
            Vous ne pourrez plus envoyer ou recevoir de messages et l'ensemble de vos publications seront supprimées.
          </span>
        </div>
      </template>
      <template v-slot:footer>
        <div class="row items-center justify-end">
          <button @click="showDeleteModal = false" class="cancel-button br-xs pa-xs bg-secondary text-white mr-sm">
            Annuler
          </button>
          <button @click="deleteUser" class="delete-button br-xs pa-xs text-secondary">Supprimer</button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue';
import InputField from '../components/InputField/InputField.vue';
import Avatar from '../components/Avatar/Avatar.vue';
import { useUser } from '../store/user/user.store';
import { ICreateUser } from '../interface/user/user';
import { useApi } from '../mixins/api/api.mixins';
import { showSuccessBanner, showErrorBanner } from '../mixins/banners/banners.mixins';
import Dialog from '../components/Dialog/Dialog.vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { dataURLtoFile } from '../helpers/base64/base64';

interface CropperInterface {
  getResult: () => any;
}
export default defineComponent({
  name: 'Settings',
  components: {
    InputField,
    Avatar,
    Cropper,
    Dialog,
  },
  setup(props, context) {
    const showModal = ref(false);
    const showDeleteModal = ref(false);

    const cropper = ref<CropperInterface | null>(null);

    const profilPicInput = ref<HTMLInputElement | null>(null);

    const { getUserInfos, getUserPic, logout, saveEditedUser, deleteMe } = useUser();
    const { getCurrentUser } = useApi();

    const editedPassword = ref('');
    const editedPasswordCopy = ref('');
    const previewImage = ref<string | undefined | null>(null);

    const user = computed(() => getUserInfos.value);
    const userPic = computed(() => getUserPic.value);

    const editPassword = ref(false);

    const editedUser = ref<Omit<ICreateUser, 'password'>>({
      firstname: '',
      lastname: '',
      email: '',
      job: undefined,
      userPic: null,
    });

    const onEditPassword = () => {
      editPassword.value = !editPassword.value;
    };
    const onSaveProfile = async () => {
      if (!editedUser.value) return;
      if (user.value == editedUser.value && !editedPassword.value) return;
      if (editPassword.value) {
        if (!editedPassword.value || editedPassword.value.trim() !== editedPasswordCopy.value.trim()) {
          return showErrorBanner('Les deux champs mot de passe ne sont pas identiques');
        } else {
          const result = await saveEditedUser(user.value.id, editedUser.value, editedPassword.value);
          if (!result) return showErrorBanner("Les changements n'ont pas pu être sauvegardés");
          editPassword.value = false;
          editedPassword.value = '';
          editedPasswordCopy.value = '';
          return showSuccessBanner('Changements sauvegardés avec succès !');
        }
      }
      const result = await saveEditedUser(user.value.id, editedUser.value);
      if (!result) return showErrorBanner("Les changements n'ont pas pu être sauvegardés");
      editPassword.value = false;
      editedPassword.value = '';
      editedPasswordCopy.value = '';
      return showSuccessBanner('Changements sauvegardés avec succès !');
    };

    const deleteUser = async () => {
      await deleteMe(user.value.id);
    };

    const pickFile = () => {
      if (!profilPicInput.value) return;

      const file = profilPicInput.value.files;

      if (file && file[0]) {
        if (file[0].size >= 5 * 1024 * 1024) {
          alert('Your file is too big to be upload on profile pic');
          return;
        }
        editedUser.value.userPic = file[0];

        const reader = new FileReader();
        reader.onload = (e) => {
          if (!e.target) return;
          previewImage.value = e.target.result as string;
        };
        reader.readAsDataURL(file[0]);
        context.emit('input', file[0]);
        showModal.value = true;
      }
    };

    const editUserIsFill = computed(() => {
      const { firstname, lastname, email } = editedUser.value;
      return !firstname || !lastname || !email ? false : true;
    });

    const cropImage = () => {
      if (!cropper.value) return;
      const result = cropper.value.getResult();
      if (!editedUser.value.userPic) return;
      const type = editedUser.value.userPic.type;
      previewImage.value = result.canvas.toDataURL(type);

      if (!previewImage.value) return;
      const fileName = `${user.value.firstname
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')}_${user.value.lastname.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
      const file = dataURLtoFile(previewImage.value, fileName);
      editedUser.value.userPic = file;
      showModal.value = false;
    };

    onMounted(async () => {
      if (!user.value.email) {
        const currentUser = await getCurrentUser();
        previewImage.value = currentUser.userPic || null;
        return (editedUser.value = currentUser);
      }
      editedUser.value = user.value;
      previewImage.value = userPic.value || null;
    });

    return {
      editedUser,
      onEditPassword,
      editPassword,
      logout,
      editedPassword,
      editedPasswordCopy,
      onSaveProfile,
      profilPicInput,
      pickFile,
      previewImage,
      editUserIsFill,
      cropImage,
      cropper,
      showModal,
      showDeleteModal,
      deleteUser,
    };
  },
});
</script>

<style lang="scss" scoped>
.settings {
  overflow: hidden;
  height: 100%;
  margin-right: -150px;
  padding-right: 150px;
  margin-left: -150px;
  padding-left: 150px;
}
.main-edit-container {
  height: 100%;
  overflow: scroll;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    display: none;
  }
}
.edit-form {
  min-width: 300px;
  & .edit-input {
    width: 100%;
  }
}
.save-button {
  padding: 10px 40px 10px 40px;
  transition: opacity 300ms;
  border: none;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:disabled {
    opacity: 0.3;
    cursor: no-drop;
  }
}
.delete-button {
  cursor: pointer;
  transition: all 300ms;
  &:hover {
    opacity: 0.8;
    background: rgba(#e22a7f, 0.2);
  }
}
.cancel-button {
  cursor: pointer;
  transition: opacity 300ms;
  &:hover {
    opacity: 0.8;
  }
}

.input-file {
  display: none;
}
label {
  cursor: pointer;
}
.change-password {
  background: transparent;
  transition: all 300ms;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background: rgba(grey, 0.1);
    color: black !important;
  }
}
.logout-button {
  background: transparent;
  transition: all 300ms;
  padding: 5px 10px;
  &:hover {
    background: rgba(grey, 0.1);
    color: black !important;
  }
}

.delete-user-button {
  background: transparent;
  transition: all 300ms;
  padding: 5px 10px;
  &:hover {
    background: rgba(grey, 0.1);
    color: #e22a7f !important;
  }
}
.edit-container {
  height: 100%;
}
@media screen and (max-width: 750px) {
  .edit-container {
    flex-direction: column !important;
    height: unset !important;
    & .avatar-container {
      margin-bottom: 20px;
    }
  }
}

@media screen and (max-width: 500px) {
  .edit-form {
    min-width: 250px;
  }
}
.cropper {
  overflow: hidden;
  background: #ddd;
}
.close-button-modal {
  border-radius: 30px;
  transition: background 300ms;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  background: transparent;
  &:hover {
    background: rgba(#50505096, 0.05) !important;
  }
}
</style>
