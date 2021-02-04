<template>
  <div class="regLogContainer">
    <form
      v-if="isReg"
      class="d-flex flex-column align-content-around"
      style="width: 100%"
    >
      <label>Username
        <input
          type='text'
          v-model.trim="user.username"
          class='form-control'
          placeholder='Username'
        >
      </label>
      <label>Password
        <input
          type='password'
          v-model='user.password'
          class='form-control'
          placeholder='Password'
        >
      </label>
      <label>First Name
        <input
          type='text'
          v-model.trim="user.firstName"
          class='form-control'
          placeholder='First Name'
        >
      </label>
      <label>Last Name
        <input
          type='text'
          v-model.trim="user.lastName"
          class='form-control'
          placeholder='Last Name'
        >
      </label>
      <label>Balance
        <input
          type='number'
          v-model.trim="user.userBalance"
          class='form-control'
        >
      </label>
      <label>Addresses
        <div v-for="(address, index) in user.addresses" :key="address" class="listEntity">
          <p class="listText">{{address}}</p>
          <button
            class="btn btn-danger listbtn"
            @click.prevent="removeAddress(index)"
          >
            X
          </button>
        </div>
        <div class="listEntity">
          <b-form-textarea @keypress.enter.prevent="addAddress" v-model="addressText"/>
          <button
            class="btn btn-success listbtn"
            @click.prevent="addAddress"
          >
            +
          </button>
        </div>

      </label>
      <label>Phone Numbers
        <div
          v-for="(phoneNumber, index) in user.phoneNumbers"
          :key="phoneNumber"
          class="listEntity"
        >
          <p class="listText">{{phoneNumber}}</p>
          <button
            class="btn btn-danger listbtn"
            @click.prevent="removePhoneNumber(index)"
          >
            X
          </button>
        </div>
        <div class="listEntity">
          <b-form-textarea @keypress.enter.prevent="addPhoneNumber" v-model="phoneNumberText"/>
          <button
            class="btn btn-success listbtn"
            @click.prevent="addPhoneNumber"
          >
            +
          </button>
        </div>

      </label>
      <label>User type:
        <select class="form-control" v-model='user.userType'>
          <option disabled value=''>Please select one</option>
          <option value='normal'>Normal</option>
          <option value='student'>Student</option>
          <option value='professor'>Professor</option>
          <option value='librarian'>Librarian</option>
          <option value='manager'>Manager</option>
        </select>
      </label>
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__zoomIn"
        leave-active-class="animate__animated animate__zoomOut"
      >
        <div key='normal' v-if="user.userType==='normal'">
          <label>Job
            <input
              type='text'
              v-model.trim="user.normalUserJob"
              class='form-control'
              placeholder='Username'
            >
          </label>
        </div>
        <div key='student' v-else-if="user.userType==='student'">
          <label>Student Number
            <input
              type='text'
              v-model.trim="user.studentNumber"
              class='form-control'
              placeholder='Username'
            >
          </label>
          <label>University
            <input
              type='text'
              v-model.trim="user.studentUniversity"
              class='form-control'
              placeholder='Username'
            >
          </label>
        </div>
        <div key='professor' v-else-if="user.userType==='professor'">
          <label>Professor ID
            <input
              type='text'
              v-model.trim="user.professorId"
              class='form-control'
              placeholder='Username'
            >
          </label>
          <label>University
            <input
              type='text'
              v-model.trim="user.professorUniversity"
              class='form-control'
              placeholder='Username'
            >
          </label>
        </div>
      </transition>
      <input
        @click.prevent='register'
        type='submit'
        class='c_submit btn btn-success form-control'
        value='Register'
      >
    </form>
    <form
      v-else
      class="d-flex flex-column align-content-around"
      style="width: 100%"
    >
      <label class="align-self">Username
        <input
          type='text'
          v-model.trim="user.username"
          class='form-control'
          placeholder='Username'
        >
      </label>
      <label>Password
        <input
          type='password'
          v-model='user.password'
          class='form-control'
          placeholder='Password'
        >
      </label>
      <input
        @click.prevent='login'
        type='submit'
        class='c_submit btn btn-success form-control'
        value='Login'
      >
    </form>
    <button
      v-if="isReg"
      class="btn btn-outline-secondary w-50 m-1"
      @click="isReg = false"
    >
      Login
    </button>
    <button
      v-else
      class="btn btn-outline-secondary w-50 m-1"
      @click="isReg = true"
    >
      Register
    </button>
  </div>
</template>

<script>
export default {
  name: 'RegisterAndLogin',
  data() {
    return {
      isReg: false,
      user: {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        userBalance: 0,
        phoneNumbers: [],
        addresses: [],
        userType: '',
        normalUserJob: '',
        studentNumber: '',
        studentUniversity: '',
        professorId: '',
        professorUniversity: '',
      },
      addressText: '',
      phoneNumberText: '',
    };
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', this.user);
        this.$notify({
          group: 'main',
          title: 'Login successful',
          type: 'success',
        });
        this.$router.push('panel');
      } catch (err) {
        if (err.response) {
          this.$notify({
            group: 'main',
            title: 'Login error',
            text: err.response.data,
            type: 'error',
          });
        }
      }
    },
    async register() {
      try {
        await this.$http.post('/users', this.user);
        this.$notify({
          group: 'main',
          title: 'Register successful',
          type: 'success',
        });
      } catch (err) {
        if (err.response) {
          this.$notify({
            group: 'main',
            title: 'Register error',
            text: err.response.data,
            type: 'error',
          });
        }
      }
    },
    removeAddress(index) {
      this.user.addresses.splice(index, 1);
    },
    addAddress() {
      if (this.addressText) {
        this.user.addresses.push(this.addressText);
        this.addressText = '';
      }
    },
    removePhoneNumber(index) {
      this.user.phoneNumbers.splice(index, 1);
    },
    addPhoneNumber() {
      if (this.phoneNumberText) {
        this.user.phoneNumbers.push(this.phoneNumberText);
        this.phoneNumberText = '';
      }
    },
  },
};
</script>

<style scoped>
  .regLogContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
    box-shadow: 2px 4px 11px 5px rgba(0,0,0,0.54);
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    margin: 0 auto;
    min-width: 350px;
    max-width: 350px;
    min-height: 300px;
    padding: 20px;
  }

  .listEntity {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 2px;
    border-top: 1px solid #bbb;
    border-bottom: 1px solid #bbb;
    margin: 2px 0;
  }

  .listbtn {
    padding: 1px;
    min-width: 30px;
    width: 30px;
    height: 30px;
    border-radius: 10px;
    margin-left: 5px;
  }

  .listText {
    margin: 0 5px;
    text-align: left;
  }
</style>
