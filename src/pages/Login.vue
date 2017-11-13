<template lang="pug">
  el-card(class="login-card")
    div(slot="header")
      img.logo-img(:src="logo")
      span.logo-text utab admin interface
      span.message {{ message }}
    el-form.login(:rules="rules", ref="ruleForm", :model="ruleForm", label-width="100px")
      el-form-item(label="User Type", prop="usertype")
        el-select(placeholder="Select User Type", v-model="ruleForm.usertype")
          el-option(v-for="option in usertypes", :key="option", :value="option", :label="capitalize(option)")
      el-form-item(label="User Name", prop="username", v-if="ruleForm.usertype === 'organizer'")
        el-input(placeholder="Input User Name", v-model="ruleForm.username", type="text", autofocus)
      el-form-item(label="Password" prop="password")
        el-input(placeholder="Input Password", v-model="ruleForm.password", type="password", @keyup.enter.native="onLogin")
        span.fail-text(v-if="login_failed") Incorrect Username or Password
      el-form-item
        el-button(type="primary", @click="onLogin", :loading="loading") {{ loading ? 'Loading...' : 'Login' }}
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
          usertype: '',
          username: '',
          password: ''
        },
        rules: {
          password: [
             { required: true, message: 'Password required', trigger: 'blur' }
          ]
        },
        error: null
      }
    },
    computed: {
      ...mapState([
        'tournaments'
      ]),
      usertypes () {
        let tournament = this.tournaments.find(t => t.id === parseInt(this.$route.query.tournament_id, 10))
        let usertypes = ['organizer']
        if (tournament !== undefined) {
          for (let usertype of ['speaker', 'audience', 'adjudicator']) {
            if (tournament.auth[usertype].required) {
              usertypes.push(usertype)
            }
          }
        }
        return usertypes
      },
      message () {
        return this.$route.query.message
      }
    },
    methods: {
      capitalize: math.capitalize,
      onHome () {
        this.$router.push('/')
      },
      onLogin () {
        this.loading = true
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            let username = this.ruleForm.usertype === 'organizer' ? this.ruleForm.username : this.$route.query.tournament_id+this.ruleForm.usertype
            const is_auth = await this.login({ username, password: this.ruleForm.password })
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
      },
      ...mapActions([
        'login'
      ])
    }
  }
</script>

<style>
  .login-card {
    width: 280px;
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
