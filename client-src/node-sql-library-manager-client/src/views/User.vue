<template>
  <div>
    <request-form
      :reqName="'Add Balance'"
      :reqMethod="'post'"
      :reqURL="'/users/balance'"
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
import RequestForm from '@/components/RequestForm.vue';

export default {
  name: 'User',
  components: {
    RequestForm,
  },
};
</script>

<style scoped>

</style>
