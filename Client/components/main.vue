<template>
  <div id="main">
    <h1 class="title">不晓得是哪个在说话的匿名聊天室</h1>
    <div class="messages" ref="m">
      <transition-group
        v-if="messages"
        name="msg-box"
        tag="ul"
        ref="n"
        class="msg-box"
        @before-enter="beforeEnter"
        appear
      >
        <li class="msg-item" v-for="(msg,index) in messages" :key="msg.key" :data-index="index">
          <!-- <span>{{ msg.key | time }}</span> -->
          <span>{{ msg.speaker }}</span>
          : {{ msg.message }}
        </li>
      </transition-group>
    </div>
    <label for="msg" class="message">
      <span class="message-title">You:</span>
      <input type="text" @keypress.enter="send" name="msg" id="msg" v-model="message" />
      <button class="send" @click="send">Send</button>
    </label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userinfo: undefined,
      ws: undefined,
      message: "",
      messages: null,
      init_num: undefined
    };
  },
  methods: {
    send() {
      if (!this.ws) return;
      if (this.message == "") return;
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({
            speaker: this.userinfo,
            message: this.message
          })
        );
        this.message = "";
      } else {
        alert("Disconnected From the Server");
      }
    },
    beforeEnter(el) {
      if (el.dataset.index < this.init_num) {
        el.style.transitionDelay = `${0.1 * el.dataset.index}s`;
      }
    }
  },
  filters: {
    time(val) {
      let t = new Date(val);
      let now = Date.now();
      let sub = now - t;
      if (sub < 60000) return `${parseInt(sub / 1000)}s ago`;
      else if (sub < 3600000) return `${parseInt(sub / 60000)} minutes ago`;
      else if (sub < 86400000) return `${parseInt(sub / 3600000)} huors ago`;
      else return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
    }
  },
  beforeCreate() {
    let xhr = new XMLHttpRequest();
    xhr.open("get", "http://127.0.0.1:8888/datainit");
    let _this = this;
    xhr.onload = function() {
      // console.log(JSON.parse(this.response));
      if (JSON.parse(this.response) === []) return;
      _this.messages = JSON.parse(this.response).reverse();
      _this.init_num = _this.messages.length;
    };
    xhr.send();
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem("isLogin")).user;
  },
  mounted() {
    this.ws = new WebSocket("ws://127.0.0.1:7777");
    this.ws.onopen = function() {
      console.log("Connection Established");
    };
    this.ws.onclose = function() {
      console.log("Disconnected");
    };
    this.ws.onmessage = e => {
      if (this.messages) this.messages.push(JSON.parse(e.data));
      // console.log(JSON.parse(e.data));
      console.log(this.$refs.n.$el.clientHeight);
      setTimeout(() => {
        this.$refs.m.scroll({
          top: this.$refs.n.$el.clientHeight,
          behavior: "smooth"
        });
      }, 30);
    };
  }
};
</script>

<style lang='scss' scoped>
#main {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 1em 0;
  .title {
    color: white;
    margin-bottom: 0.5em;
    font-size: 1.5em;
  }
  .messages {
    flex: 1;
    width: 31.8em;

    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 0.5em;
    padding: 0.5em;
    overflow: overlay;
    margin-bottom: 1em;
    .msg-box {
          overflow: hidden;
      text-align: left;
      font-size: 1.3em;
      .msg-item {
        padding-bottom: 0.3846em;
        word-break: break-all;
        & > span {
          font-weight: bold;
        }
      }
    }
    .msg-box-enter {
      opacity: 0;
      transform: translateX(1.5em);
    }
    .msg-box-enter-active {
      transition: all 0.3s ease;
    }
  }
  .message {
    font-family: tahoma, arial, "Hiragino Sans GB", simsun, sans-serif;
    display: flex;
    %fonts {
      height: 1.5em;
      line-height: 1.5em;
      padding: 0.5em 0.3em;
      border: #313251 solid 1px;
    }
    .message-title {
      @extend %fonts;
      width: 5em;
      border-radius: 0.5em 0 0 0.5em;
      border-right: none;
      background-color: rgba(255, 255, 255, 0.8);
    }
    #msg {
      @extend %fonts;
      width: 20em;
      transition: all 0.3s ease;
      z-index: 2;
      &:focus {
        border-color: #313251;
        box-shadow: #313251 0 0 10px;
      }
    }
    .send {
      @extend %fonts;
      width: 5em;
      border-left: none;
      box-sizing: content-box;
      border-radius: 0 0.5em 0.5em 0;
      background-color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
    }
  }
}
</style>