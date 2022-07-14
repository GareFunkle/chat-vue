<template>
  <div class="view login" v-if="state.username === '' || state.username === null">
    <form class="login-form" @submit.prevent="Login">
      <div class="form-inner">
        <h1>Se Connecter au Chat</h1>
        <label for="username">Nom d'Utilisateur</label>
        <input type="text" v-model="inputUsername" placeholder="Veuillez entrée votre Nom d'Utilisateur" />
        <input type="submit" value="connexion" />
      </div>
    </form>
  </div>

  <div class="view chat" v-else>
    <header>
      <button class="logout" @click="Logout">Déconnexion</button>
      <h1>Bienvenue, {{ state.username }}</h1>
    </header>

    <div class="chat">
      <div class="chat-box">

        <div v-for="message in state.messages" :key="message.key"
          :class="(message.username == state.username ? 'message current-user' : 'message')">
          <div class="message-inner">
            <div class="username">{{ message.username }}</div>
            <div class="content">{{ message.content }}</div>
          </div>
        </div>
      </div>

    </div>

    <footer>
      <form @submit.prevent="SendMessage">
        <input type="text" v-model="inputMessage" placeholder="Ecrire un message..." />
        <input type="submit" value="Envoyé" />
      </form>
    </footer>
    <div ref="bottom" />
  </div>

</template>

<script>
import { reactive, onMounted, ref, watch, nextTick } from 'vue';
import { ref as sRef, set, push, onValue } from "firebase/database";
import { db } from './db.js';

export default {
  setup() {
    const inputUsername = ref("");
    const inputMessage = ref("");
    const bottom = ref(null)

    const state = reactive({
      username: "",
      messages: [],
      // scrolled: false,
    })

    watch(
      inputUsername,
      () => {
        nextTick(() => {
          bottom.value?.scrollIntoView({ behavior: 'smooth' })
        })
      },
      { deep: true }
    )
    watch(
      inputMessage,
      () => {
        nextTick(() => {
          bottom.value?.scrollIntoView({ behavior: 'smooth' })
        })
      },
      { deep: true }
    )

    const Login = () => {
      if (inputUsername.value != "" || inputUsername.value != null) {
        state.username = inputUsername.value;
        inputUsername.value = "";
      }
    };
    const Logout = () => {
      state.username = "";
    };
    const SendMessage = () => {
      if (inputMessage.value === "" || inputMessage.value === null) {
        return;
      }
      const message = {
        username: state.username,
        content: inputMessage.value,
      };
      set(push(sRef(db, "messages")), message);
      inputMessage.value = "";
    };

    // const updateScrolled = () => {
    //   if (!state.scrolled) {
    //     var chat = this.$refs.chat;
    //     chat.scrollTop = chat.scrollHeight;
    //   }
    //   this.$refs.chat.$chat.scroll()
    // };
    onMounted(() => {
      const messagesRef = sRef(db, "messages");
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        let messages = [];
        Object.keys(data).forEach(key => {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content
          });
        });
        state.messages = messages;
      })
    })
    return {
      inputUsername,
      Login,
      state,
      inputMessage,
      SendMessage,
      Logout,
      bottom,
    };
  },
}

</script>

<style lang="scss">
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.view {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #1b4f72;

  &.login {
    align-items: center;

    .login-form {
      display: block;
      width: 100%;
      padding: 15px;

      .form-inner {
        display: block;
        background-color: #FFF;
        padding: 50px 15px;
        border-radius: 16px;
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);

        h1 {
          color: #AAA;
          font-size: 28px;
          margin-bottom: 30px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          color: #AAA;
          font-size: 16px;
          transition: 0.4s;
        }

        input[type="text"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 15px;

          color: #333;
          font-size: 18px;
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #F3F3F3;
          transition: 0.4s;

          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }

        input[type="submit"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          background-color: #5dade2;
          border-radius: 8px;
          color: #FFF;
          font-size: 18px;
          font-weight: 700;
        }

        &:focus-within {
          label {
            color: #5dade2;
          }

          input[type="text"] {
            background-color: #FFF;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);

            &::placeholder {
              color: #666;
            }
          }
        }
      }
    }
  }

  &.chat {
    flex-direction: column;

    header {
      position: relative;
      display: block;
      width: 100%;
      padding: 50px 30px 10px;

      .logout {
        position: absolute;
        top: 15px;
        right: 15px;
        appearance: none;
        border: none;
        outline: none;
        background: none;

        color: #FFF;
        font-size: 18px;
        margin-bottom: 10px;
        text-align: right;
        transition: 00.4s;
      }

      .logout:hover {
        cursor: pointer;
      }

      h1 {
        color: #FFF;
      }
    }

    .chat-box {
      border-radius: 24px 24px 0px 0px;
      background-color: #d6eaf8;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
      flex: 1 1 100%;
      padding: 30px;

      .message {
        display: flex;
        margin-bottom: 15px;

        .message-inner {
          .username {
            color: black;
            font-size: 16px;
            margin-bottom: 5px;
            padding-left: 15px;
            padding-right: 15px;
          }

          .content {
            display: inline-block;
            padding: 10px 20px;
            background-color: #F3F3F3;
            border-radius: 995px;
            color: #333;
            font-size: 15px;
            line-height: 1.2em;
            text-align: left;
            transition: 00.4s;
          }

        }

        &.current-user {
          margin-top: 30px;
          justify-content: flex-end;
          text-align: right;

          .message-inner {
            max-width: 75%;

            .content {
              color: #FFF;
              font-weight: 600;
              background-color: #3faae7;
            }
          }
        }
      }
    }

    footer {
      position: sticky;
      bottom: 0px;
      background-color: #FFF;
      padding: 30px;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);

      form {
        display: flex;

        input[type="text"] {
          flex: 1 1 100%;
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px 0px 0px 8px;

          color: #333;
          font-size: 18px;
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #F3F3F3;
          transition: 0.4s;

          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }

        input[type="submit"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          padding: 10px 15px;
          border-radius: 0px 8px 8px 0px;
          background-color: #5dade2;
          color: #FFF;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
        }

      }
    }
  }
}
</style>
