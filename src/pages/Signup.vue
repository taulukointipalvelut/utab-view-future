<template lang="pug">
  el-card(class="signup-card")
    div(slot="header")
      img.logo-img(:src="logo")
      span.logo-text Sign Up As Tournament Organizer
    el-form.signup(:rules="rules", ref="ruleForm", :model="ruleForm", label-width="100px")
      el-form-item(label="User Name", prop="username")
        el-input(:minlength="8", placeholder="Please enter User Name", v-model="ruleForm.username", type="text", autofocus)
      el-form-item(label="Password" prop="password")
        el-input(:minlength="8", placeholder="Please enter Password", v-model="ruleForm.password", type="password", @keyup.enter.native="onRegister")
        span.fail-text(v-if="signup_failed") Username Already Exists
      el-form-item
        el-button(type="primary", @click="onRegister", :loading="loading", :disabled="ruleForm.username.length < 8 || ruleForm.password.length < 8") {{ loading ? 'Loading...' : 'Register' }}
        el-button(type="text", @click="onHome") Go back to Home
      span.short-text(v-if="ruleForm.username.length < 8 || ruleForm.password.length < 8") Username or Password too short
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import logo from 'assets/img/logo.png'

  export default {
    data () {
      return {
        logo: logo,
        loading: false,
        signup_failed: false,
        ruleForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
             { required: true, message: 'User Name required', trigger: 'blur' }
          ],
          password: [
             { required: true, message: 'Password required', trigger: 'blur' }
          ]
        },
        error: null
      }
    },
    computed: {
      /*message () {
        return this.$route.query.message
      }*/
    },
    methods: {
      onHome () {
        this.$router.push('/')
      },
      onRegister () {
        this.loading = true
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            let success = await this.signup({ username: this.ruleForm.username, password: this.ruleForm.password })
            if (success) {
              await this.login({ username: this.ruleForm.username, password: this.ruleForm.password })
              const next = this.$route.query.next
              this.$router.push(next ? next : '/')
            } else {
              this.signup_failed = true
              this.error = 'Unable to signup'
            }
            this.loading = false
          }
        })
      },
      ...mapActions([
        'login',
        'signup'
      ])
    }
  }
</script>

<style>
  .signup-card {
    width: 280px;
    height: 400px;
    margin: calc((100vh - 400px) / 2) auto;
  }
  .signup {
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
  .short-text {
    display: inline-block;
    color: red;
    font-size: 0.8rem;
  }
  @media (min-width: 600px) {
    .signup-card {
      width: 600px;
    }
    .signup {
      display: block;
      width: 400px;
      margin: 5% auto;
    }
    .logo-text {
      margin-left: 20px;
    }
  }
</style>
