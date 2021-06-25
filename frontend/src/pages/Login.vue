<template>
  <div class="login-container bg-primary pa-xl text-white row items-center justify-center">
    <div class="half-width row justify-center">
      <img src="../assets/logo_groupomania_white.png" alt="Logo Groupomania" />
    </div>
    <div class="column items-center half-width login-carousel justify-center">
      <div class="row items-center justify-around login-carousel__selectors">
        <div
          class="login-carousel__selectors--selector"
          :class="loginOrSignupStep == 'login' ? 'bg-white' : 'bg-transparent'"
          @click="goToLogin"
        ></div>
        <div
          class="login-carousel__selectors--selector"
          :class="loginOrSignupStep == 'signup' ? 'bg-white' : 'bg-transparent'"
          @click="goToSignup"
        ></div>
      </div>

      <div
        class="row items-center justify-center full-width position-relative forms-container"
        :style="loginOrSignupStep == 'login' ? 'height:300px;' : 'height:500px;'"
      >
        <div id="login-form" class="column items-center full-width position-absolute">
          <form class="column items-center full-width" @submit.prevent="onLogin">
            <InputField
              type="email"
              @onInput="(val) => (userMail = val)"
              :value="userMail"
              placeholder="Mail"
              borderRadius="8px"
              :minLength="10"
              :maxLength="100"
              class="login-input mb-lg mt-xl"
              fontSize="16px"
            />
            <InputField
              type="password"
              @onInput="(val) => (userPassword = val)"
              :value="userPassword"
              placeholder="Mot de passe"
              borderRadius="8px"
              :minLength="8"
              :maxLength="50"
              class="login-input mb-lg"
              fontSize="16px"
            />
            <input
              type="submit"
              class="login-button bg-secondary text-white br-sm my-md font-16"
              value="Se connecter"
              :disabled="!loginFormIsFill"
            />
          </form>
          <button @click.stop="goToSignUp" class="text-white font-14">Créer un compte</button>
        </div>

        <div id="signup-form" class="column full-width items-center position-absolute">
          <form class="column items-center full-width" @submit.prevent="onSignup">
            <InputField
              @onInput="(val) => (firstname = val)"
              :value="firstname"
              placeholder="Prénom"
              borderRadius="8px"
              :maxLength="40"
              class="login-input mb-lg"
              fontSize="16px"
              required
            />
            <InputField
              @onInput="(val) => (lastname = val)"
              :value="lastname"
              placeholder="Nom"
              borderRadius="8px"
              :maxLength="40"
              class="login-input mb-lg"
              fontSize="16px"
              required
            />
            <InputField
              @onInput="(val) => (job = val)"
              :value="job"
              placeholder="Job"
              borderRadius="8px"
              :maxLength="60"
              class="login-input mb-lg"
              fontSize="16px"
            />
            <InputField
              type="email"
              @onInput="(val) => (email = val)"
              :value="email"
              placeholder="Mail"
              borderRadius="8px"
              :maxLength="100"
              class="login-input mb-lg"
              fontSize="16px"
              required
            />
            <InputField
              type="password"
              @onInput="(val) => (password = val)"
              :value="password"
              placeholder="Mot de passe"
              borderRadius="8px"
              :minLength="8"
              :maxLength="50"
              class="login-input mb-lg"
              fontSize="16px"
              required
            />
            <input
              type="submit"
              class="login-button bg-secondary text-white br-sm my-md font-16"
              value="Créer un compte"
              :disabled="!signupFormIsFill"
            />
          </form>
          <button @click.stop="goToLogin" class="text-white font-14">Se connecter</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, computed } from 'vue';
import { useUser } from '../store/user/user.store';
import InputField from '../components/InputField/InputField.vue';
import { showErrorBanner } from '../mixins/banners/banners.mixins';

export default defineComponent({
  name: 'LoginPage',
  components: {
    InputField,
  },
  setup(props, context) {
    const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { login, signup } = useUser();

    const createUser = reactive({
      firstname: '',
      lastname: '',
      email: '',
      job: '',
      password: '',
    });

    const userMail = ref('');
    const userPassword = ref('');

    const loginOrSignupStep = ref('login');

    const validEmail = (email: string) => {
      return emailRegExp.test(email);
    };

    const onLogin = async () => {
      if (validEmail(userMail.value)) {
        const user = await login(userMail.value, userPassword.value);
        if (!user || !user.token) return showErrorBanner('Email ou mot de passe incorrect');
        return;
      }
      showErrorBanner('Impossible de se connecter, veuillez rentrer un mail valide');
    };

    const onSignup = async () => {
      if (validEmail(createUser.email)) {
        await signup(createUser);
        return;
      }
      showErrorBanner('Impossible de créer un compte, veuillez vérifier vos informations');
    };

    const goToSignUp = () => {
      loginOrSignupStep.value = 'signup';
      const signupContainer = document.getElementById('signup-form');
      const loginContainer = document.getElementById('login-form');
      if (!loginContainer || !signupContainer) return;
      signupContainer.classList.add('signup-show');
      loginContainer.classList.add('login-hidden');
    };
    const goToLogin = () => {
      loginOrSignupStep.value = 'login';
      const signupContainer = document.getElementById('signup-form');
      const loginContainer = document.getElementById('login-form');
      if (!loginContainer || !signupContainer) return;
      signupContainer.classList.remove('signup-show');
      loginContainer.classList.remove('login-hidden');
    };

    const loginFormIsFill = computed(() => {
      return (!userMail.value || !userPassword.value) ? false : true;
    });
    const signupFormIsFill = computed(() => {
      const { firstname, lastname, email, password } = createUser;
      return !firstname || !lastname || !email || !password ? false : true;
    });

    return {
      userMail,
      userPassword,
      onLogin,
      ...toRefs(createUser),
      onSignup,
      loginOrSignupStep,
      goToSignUp,
      goToLogin,
      loginFormIsFill,
      signupFormIsFill,
    };
  },
});
</script>

<style lang="scss" scoped>
.forms-container {
  transition: all 500ms 300ms;
}
.login-hidden {
  left: -100% !important;
}
#login-form {
  left: 0;
  transition: all 1s;
}
#signup-form {
  left: 100%;
  transition: all 1s;
}
.signup-show {
  left: 0 !important;
}
.login-container {
  min-height: 100vh;
  flex-wrap: wrap;
}
.login-carousel {
  min-width: 320px;
  overflow: hidden;
  &__selectors {
    width: 100px;
    &--selector {
      cursor: pointer;
      border: 2px solid white;
      border-radius: 30px;
      width: 20px;
      height: 20px;
    }
  }
}
.login-button {
  padding: 10px 40px 10px 40px;
  transition: opacity 300ms;
  cursor: pointer;
  border: none;
  &:hover {
    opacity: 0.8;
  }
  &:disabled{
    opacity: 0.3;
    cursor: no-drop;
  }
}
.login-input {
  min-width: 300px;
  width: 70%;
}
img {
  width: 80%;
}
</style>
