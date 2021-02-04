<template>
  <div class="home d-flex flex-column justify-content-around align-items-center">
    <RegisterAndLogin/>
  </div>
</template>

<script>
// @ is an alias to /src
import RegisterAndLogin from '@/components/RegisterAndLogin.vue';

export default {
  name: 'Home',
  components: {
    RegisterAndLogin,
  },
};
</script>
