<template>
  <el-card class="login-card">
    <div slot="header">
      <img :src="logo" class="logo-img">
      <span class="logo-text">utab admin interface</span>
    </div>
    <el-form class="login" :rules="rules" ref="ruleForm" :model="ruleForm" label-width="100px" >
      <el-form-item label="User Name" prop="user_name">
        <el-input placeholder="Please enter User Name" v-model="ruleForm.user_name" type="text"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input placeholder="Please enter Password" v-model="ruleForm.password" type="password" @keyup.enter="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login" :loading="loading">{{ loading ? 'Loading...' : 'Login' }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import qs from 'qs'
  import logo from 'assets/img/logo.png'

  export default {
    data () {
      return {
        logo: logo,
        loading: false,
        ruleForm: {
          user_name: '',
          password: ''
        },
        rules: {
          user_name: [
             { required: true, message: 'User Name required', trigger: 'blur' }
          ],
          password: [
             { required: true, message: 'Password required', trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      login () {
        this.loading = true
        this.$refs.ruleForm.validate((valid) => {
          if (!valid) {
            return
          }
          const next = qs.parse(location.search.slice(1)).next
          location.href = next ? next : '/'
        })
      }
    }
  }
</script>

<style>
  .login-card {
    width: 280px;
    margin: auto 0;
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
  @media (min-width: 600px) {
    .login-card {
      width: 600px;
      margin: auto;
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
