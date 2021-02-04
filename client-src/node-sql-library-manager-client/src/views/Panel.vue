<template>
  <div class="d-flex flex-column align-items-center justify-content-around">
    <me-panel :user="user"/>
  </div>
</template>

<script>
import MePanel from '@/components/MePanel.vue';

export default {
  name: 'Panel',
  components: {
    MePanel,
  },
  data() {
    return {
      user: undefined,
    };
  },
  async mounted() {
    try {
      this.user = (await this.$http.get('/users/me')).data;
    } catch (err) {
      if (err.response) {
        this.$notify({
          group: 'main',
          title: 'Get self error',
          text: err.response.data,
          type: 'error',
        });
      }
    }
  },
};
</script>

<style scoped>

</style>
