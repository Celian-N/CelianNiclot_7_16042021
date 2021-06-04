<template>
  <div class="settings">
    <div class="bg-white main-shadow pa-sm br-md full-height edit-container column">
      <div class="row items-center full-height">
        <div class="row items-center justify-around full-width">
          <div class="column items-center">
            <Avatar size="200px" :userPic="previewImage" class="mb-sm" />
            <label for="profilePic" class="row items-center justify-center"
              ><span>Modifier ma photo de profil</span></label
            >
            <input
              id="profilePic"
              ref="profilPicInput"
              name="profilePic"
              type="file"
              class="input-file"
              accept="image/*"
              @input="pickFile"
            />
          </div>

          <div v-if="editedUser" class="column items-center edit-form">
            <form class="column items-center full-width" @submit="onSaveProfile">
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
      </div>
      <button @click="logout" class="logout-button self-center text-caption br-xs">Se deconnecter</button>
    </div>
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

export default defineComponent({
  name: 'Settings',
  components: {
    InputField,
    Avatar,
  },
  setup(props, context) {
    const profilPicInput = ref<HTMLInputElement | null>(null);

    const { getUserInfos, getUserPic, logout, saveEditedUser } = useUser();
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
          console.log('editedUser : ', editedUser.value);
          const result = await saveEditedUser(user.value.id, editedUser.value, editedPassword.value);
          if (!result) return showErrorBanner("Les changements n'ont pas pu être sauvegardés");
          editPassword.value = false;
          editedPassword.value = '';
          editedPasswordCopy.value = '';
          return showSuccessBanner('Changements sauvegardés avec succès !');
        }
      }
      console.log('editedUser : ', editedUser.value);
      const result = await saveEditedUser(user.value.id, editedUser.value);
      if (!result) return showErrorBanner("Les changements n'ont pas pu être sauvegardés");
      editPassword.value = false;
      editedPassword.value = '';
      editedPasswordCopy.value = '';
      return showSuccessBanner('Changements sauvegardés avec succès !');
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
      }
    };

    const editUserIsFill = computed(() => {
      const { firstname, lastname, email } = editedUser.value;
      return !firstname || !lastname || !email ? false : true;
    });

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
.edit-container {
  height: 80vh;
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
</style>
