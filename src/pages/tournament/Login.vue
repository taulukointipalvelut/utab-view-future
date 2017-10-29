<template lang="pug">
  el-card(class="login-card")
    div(slot="header")
      img.logo-img(:src="logo")
      span.logo-text {{ capitalize($route.query.usertype) }} Login
      span.message {{ message }}
    el-form.login(:rules="rules", ref="ruleForm", :model="ruleForm", label-width="100px")
      el-form-item(label="Login Key", prop="login_key")
        el-input(placeholder="Please enter Login Key", v-model="ruleForm.login_key", type="text", autofocus)
        span.fail-text(v-if="login_failed") Incorrect Login Key
      el-form-item
        el-button(type="primary", @click="onLogin", :loading="loading", :disabled="ruleForm.login_key === ''") {{ loading ? 'Loading...' : 'Login' }}
        el-button(type="text", @click="onHome") Go back to Home
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import logo from 'assets/img/logo.png'
  import math from 'assets/js/math'

  export default {
    data () {
      return {
        logo: logo,
        loading: false,
        login_failed: false,
        ruleForm: {
          login_key: ''
        },
        rules: {
          login_key: [
             { required: true, message: 'Login key required', trigger: 'blur' }
          ]
        },
        error: null
      }
    },
    computed: {
      ...mapGetters([
        'target_tournament'
      ]),
      message () {
        return this.$route.query.message
      }
    },
    methods: {
      capitalize: math.capitalize,
      ...mapActions([
        'participant_login'
      ]),
      onHome () {
        this.$router.push('/')
      },
      onLogin () {
        this.loading = true
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            const is_auth = await this.participant_login({ tournament: { id: this.target_tournament.id }, login_key: this.ruleForm.login_key, usertype: this.$route.query.usertype })
            if (is_auth) {
              const next = this.$route.query.next
              this.$router.push(next ? next : '/')
            } else {
              this.login_failed = true
              this.error = 'Unable to login'
            }
          }
          this.loading = false
        })
      }
    }
  }
</script>

<style>
  .login-card {
    width: 280px;
    height: 400px;
    margin: calc((100vh - 400px) / 2) auto;
  }
  .login {
    display: block;
    margin: 5% auto;
  }
  .logo-img {
    width: 90px;
  }
  .logo-text {
    display: inline-block;
    font-family: "Oswald", sans-serif;
    color: gray;
  }
  .message {
    color: red;
    font-size: 13px;
    float: right;
  }
  .fail-text {
    display: inline-block;
    color: red;
  }
  @media (min-width: 600px) {
    .login-card {
      width: 600px;
    }
    .login {
      display: block;
      width: 400px;
      margin: 5% auto;
    }
    .logo-text {
      margin-left: 20px;
    }
  }
</style>
