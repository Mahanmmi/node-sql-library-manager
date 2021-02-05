<template>
  <div class="d-flex flex-column align-items-center justify-content-around">
    <start-borrow-form/>
    <request-form
      reqName="End borrow"
      reqMethod="post"
      reqURL="/borrows/end"
      :reqBodyTypeNames="[
          {
            name: 'borrowId',
            type: 'text',
          },
        ]"
    />
  </div>
</template>

<script>
import RequestForm from '@/components/RequestForm.vue';
import StartBorrowForm from '@/components/StartBorrowForm.vue';

export default {
  name: 'Borrow',
  components: { StartBorrowForm, RequestForm },
};
</script>

<style scoped>

</style>
