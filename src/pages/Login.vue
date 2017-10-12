<template>
  <el-card class="login-card">
    <div slot="header">
      <img :src="logo" class="logo-img">
      <span class="logo-text">utab admin interface</span>
    </div>
    <el-form class="login" :rules="rules" ref="ruleForm" :model="ruleForm" label-width="100px" >
      <el-form-item label="User Name" prop="username">
        <el-input placeholder="Please enter User Name" v-model="ruleForm.username" type="text" autofocus></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input placeholder="Please enter Password" v-model="ruleForm.password" type="password" @keyup.enter.native="onLogin"></el-input>
        <span class="fail-text" v-if="login_failed">Incorrect Username or Password</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLogin" :loading="loading">{{ loading ? 'Loading...' : 'Login' }}</el-button>
        <el-button type="text" @click="onHome">Go back to Home</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import logo from 'assets/img/logo.png'

  export default {
    data () {
      return {
        logo: logo,
        loading: false,
        login_failed: false,
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
    methods: {
      onHome () {
        this.$router.push('/')
      },
      onLogin () {
        this.loading = true
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            const is_auth = await this.login({ username: this.ruleForm.username, password: this.ruleForm.password })
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
