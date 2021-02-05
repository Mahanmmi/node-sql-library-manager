<template>
  <div class="mePanelContainer">
    <div class="d-flex flex-row justify-content-start">
      <div class="userMe">
        <p><span class="tag">Username:</span> {{user.username}}</p>
        <p><span class="tag">First Name:</span> {{user.first_name}}</p>
        <p><span class="tag">Last Name:</span> {{user.last_name}}</p>
        <p><span class="tag">Balance:</span> {{user.user_balance}}</p>
        <p><span class="tag">Type:</span> {{user.user_type}}</p>
        <p><span class="tag">Create On:</span> {{user.created_on}}</p>
        <p v-if="user.user_type === 'normal'">
          <span class="tag">Job:</span> {{user.normal_user_job}}
        </p>
        <p v-if="user.user_type === 'student'">
          <span class="tag">Student Number:</span> {{user.student_number}}
        </p>
        <p v-if="user.user_type === 'student'">
          <span class="tag">University:</span> {{user.student_university}}
        </p>
        <p v-if="user.user_type === 'professor'">
          <span class="tag">Professor ID:</span> {{user.professor_id}}
        </p>
        <p v-if="user.user_type === 'professor'">
          <span class="tag">University:</span> {{user.professor_university}}
        </p>
      </div>
      <div class="userMe">
        <div v-if="user.phoneNumbers.length">
          <p><span class="tag">Phone numbers:</span></p>
          <p
            v-for="pnObj in user.phoneNumbers"
            :key="pnObj"
          >
            {{pnObj.phone_number}}
          </p>
        </div>
        <div v-if="user.addresses.length">
          <p><span class="tag">Addresses:</span></p>
          <p
            v-for="addObj in user.addresses"
            :key="addObj"
          >
            {{addObj.address}}
          </p>
        </div>
      </div>
    </div>
    <button
      class="btn btn-secondary"
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>

<script>
export default {
  name: 'MePanel',
  props: [
    'user',
  ],
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logout');
        this.$notify({
          group: 'main',
          title: 'Logout successful',
          type: 'success',
        });
        this.$router.push('home');
      } catch (err) {
        if (err.response) {
          this.$notify({
            group: 'main',
            title: 'Logout error',
            text: err.response.data,
            type: 'error',
          });
        }
      }
    },
  },
};
</script>

<style scoped>
  .mePanelContainer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 2px 4px 11px 5px rgba(0, 0, 0, 0.54);
    border-radius: 10px;
    padding: 20px;
    margin: 10px 0;
    min-width: 75%;
    width: 75%;
    max-width: 75%;
  }

  .userMe {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    text-align: left;
    max-width: 45%;
    margin: 0 30px;
  }

  .tag {
    color: gray;
  }
</style>
