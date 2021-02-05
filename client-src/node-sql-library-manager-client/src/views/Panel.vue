<template>
  <div class="d-flex flex-column align-items-center justify-content-around">
    <me-panel :user="user"/>
    <request-form
      reqName="Add Balance"
      reqMethod="post"
      reqURL="/users/balance"
      :reqBodyTypeNames="[
        {
          name: 'balance',
          type: 'number',
        }
      ]"
    />
  </div>
</template>

<script>
import MePanel from '@/components/MePanel.vue';
import RequestForm from '@/components/RequestForm.vue';

export default {
  name: 'Panel',
  components: {
    RequestForm,
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
