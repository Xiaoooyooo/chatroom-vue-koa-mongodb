<template>
  <div id="signup" class="content">
    <label for="username" class="input-label">
      <span class="input-title">Username:</span>
      <input
        type="text"
        name="username"
        :class="{'error': err_username}"
        class="input-box"
        id="username"
        @keypress="check_username"
        @blur="check_username"
        v-model="username"
      />
      <span class="error-message" v-if="err_username">用户名已存在</span>
    </label>
    <label for="passwd1" class="input-label">
      <span class="input-title">Password:</span>
      <input
        type="password"
        name="passwd1"
        :class="{'error': err_passwd}"
        class="input-box"
        id="passwd1"
        v-model="passwd1"
        @blur="check_passwd"
      />
    </label>
    <label for="passwd2" class="input-label">
      <span class="input-title">Reinput Password:</span>
      <input
        type="password"
        name="passwd2"
        :class="{'error': err_passwd}"
        class="input-box"
        id="passwd2"
        v-model="passwd2"
        @blur="check_passwd"
      />
      <span class="error-message error-message-fix" v-if="err_passwd">密码不一致</span>
    </label>
    <input type="button" class="commit" value="注册" @click="signup" />
  </div>
</template>

<script>
import http from "../functions";
export default {
  data() {
    return {
      username: "",
      passwd1: "",
      passwd2: "",
      err_username: false,
      err_passwd: false,
      timer: null
    };
  },
  methods: {
    signup() {
      if (this.passwd1 == "" || this.passwd2 == "") return;
      if (this.err_username || this.err_passwd) return;
      console.log(666);
      http(
        "http://127.0.0.1:8888/signup",
        "post",
        JSON.stringify({
          username: this.username,
          password: this.passwd1
        })
      ).then(res => {
        localStorage.setItem("isLogin", res);
        this.$router.replace({
          path: "/"
        });
      });
    },
    check_username(e) {
      if(this.username === '') return
      if (this.timer) clearTimeout(this.timer);
      switch (e.type) {
        case "keypress":
          this.timer = setTimeout(() => {
            this.func_check_username()
          }, 1000);
          break;
        case 'blur':
          this.func_check_username()
          break;
        default:
          break;
      }
    },
    func_check_username(){
      http(`http://127.0.0.1:8888/signup?username=${this.username}`,'get')
      .then(res => {
        if(res === 'false') this.err_username = true
        else this.err_username = false
      })
    },
    check_passwd() {
      if (this.passwd2 == "") return;
      if (this.passwd1 !== this.passwd2) this.err_passwd = true;
      else this.err_passwd = false;
    }
  },
  watch: {}
};
</script>

<style lang='scss' scoped>
#signup {
  .error-message {
    transform: translateX(6.5em);
  }
  .error-message-fix {
    transform: translateX(5.5em);
  }
}
</style>