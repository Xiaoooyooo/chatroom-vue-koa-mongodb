<template>
  <div id="signin" class="content">
    <h1>Hello World</h1>
    <label for="username" class="input-label">
      <span class="input-title">Username:</span>
      <input
        type="text"
        @focus="error=false"
        @keypress.enter="signin"
        name="username"
        :class="{'error': error}"
        class="input-box"
        id="username"
        v-model="username"
      />
      <span class="error-message" v-if="error">用户名或密码错误</span>
    </label>
    <label for="passwd" class="input-label">
      <span class="input-title">Password:</span>
      <input
        type="password"
        @focus="err_passwd=false"
        @keypress.enter="signin"
        name="passwd"
        class="input-box"
        id="passwd"
        v-model="passwd"
      />
      <!-- <span class="error-message" v-if="err_passwd">密码错误</span> -->
    </label>
    <input type="button" @click="signin" value="登录" class="commit" />
    <a href="javascript:;" @click="signup" class="signup">去注册</a>
  </div>
</template>

<script>
import http from "../functions";
export default {
  data() {
    return {
      username: "",
      passwd: "",
      error: false
    };
  },
  methods: {
    signin() {
      if(this.username == '' || this.passwd == '') return
      http(
        "http://127.0.0.1:8888/signin",
        "post",
        `${JSON.stringify({
          username: this.username,
          passwd: this.passwd
        })}`
      )
        .then(res => {
          console.log(res);
          res = typeof res === "string" ? JSON.parse(res) : res;
          if (res.status) {
            localStorage.setItem("isLogin", JSON.stringify(res));
            this.$router.replace({
              path: this.$route.query.from
            });
          } else {
            this.error = true;
          }
        })
        .catch(err => {
          alert("似乎是网络出现了一些问题");
        });
    },
    signup() {
      this.$router.replace({
        path: "/signup"
      });
    }
  }
};
</script>

<style lang='scss' scoped>
#signin {
  .error-message {
    transform: translateX(8.5em);
  }
  .signup {
    background: none;
    cursor: pointer;
    text-decoration: underline solid;
    transition: all 0.2s ease;
    &:hover {
      color: #0e6979;
    }
  }
}
</style>