<template>
  <div class="d-flex flex-column align-items-center justify-content-around">
    <request-form
      reqName="Create Publisher"
      reqMethod="post"
      reqURL="/books/publisher"
      :reqBodyTypeNames="[
        {
          name: 'publisherName',
          type: 'text',
        }, {
          name: 'publisherAddress',
          type: 'text',
        }, {
          name: 'publisherWebsite',
          type: 'text',
        }
      ]"
    />
    <create-book-form/>
    <request-form
      reqName="Add book"
      reqMethod="post"
      reqURL="/books/add"
      :reqBodyTypeNames="[
        {
          name: 'bookId',
          type: 'text',
        }, {
          name: 'bookVolume',
          type: 'text',
        },
      ]"
    />
    <request-form
      reqName="Search books"
      reqMethod="get"
      reqURL="/books/search"
      :reqParams="[
        'title',
        'name',
        'volume',
        'genre',
      ]"
      :resNames="[
        'bookId',
        'bookVolume',
        'book_type',
        'bookTitle',
        'bookGenre',
        'book_page_count',
        'book_price',
        'publisher_name',
        'writerName'
      ]"
    />
  </div>
</template>

<script>
import RequestForm from '@/components/RequestForm.vue';
import CreateBookForm from '@/components/CreateBookForm.vue';

export default {
  name: 'Book',
  components: {
    CreateBookForm,
    RequestForm,
  },
};
</script>

<style scoped>

</style>
