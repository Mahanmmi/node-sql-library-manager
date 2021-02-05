<template>
  <div class="d-flex flex-column align-items-center justify-content-around">
    <request-form
      reqName="Get borrowed report"
      reqMethod="get"
      :reqParams="[
        'page',
      ]"
      reqURL="/manage/borrowedbookreport"
      :resNames="[
        'request_date',
        'request_book_id',
        'request_book_volume',
      ]"
    />
    <request-form
      reqName="Delete user"
      reqMethod="delete"
      reqURL="/manage/user"
      :reqBodyTypeNames="[
          {
            name: 'username',
            type: 'text',
          }
      ]"
    />
    <request-form
      reqName="Search users"
      reqMethod="get"
      reqURL="/manage/user"
      :reqParams="[
        'username',
        'lastName',
        'page',
      ]"
      :resNames="[
        'user_name',
        'password',
        'first_name',
        'lastname',
        'user_type',
        'user_balance',
        'created_on',
      ]"
    />
    <request-form
      reqName="Get overdue books"
      reqMethod="get"
      reqURL="/manage/late"
      :resNames="[
        'bookid',
        'bookvolume',
        'in_ed_id',
        'borrow_deadline',
      ]"
    />
    <request-form
      reqName="Get book borrow history"
      reqMethod="post"
      reqURL="/manage/history"
      :reqBodyTypeNames="[
          {
            name: 'bookId',
            type: 'text',
          }, {
            name: 'bookVol',
            type: 'text',
          }
      ]"
      :resNames="[
        'user_name',
        'in_ed_id',
        'start_date',
        'end_date',
      ]"
    />
  </div>
</template>

<script>
import RequestForm from '@/components/RequestForm.vue';

export default {
  name: 'Manage',
  components: { RequestForm },
};
</script>

<style scoped>

</style>
