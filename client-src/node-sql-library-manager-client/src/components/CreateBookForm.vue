<template>
  <div class="reqWrapper">
    <p>Create Book</p>
    <form
      class="d-flex flex-column align-items-start"
      style="width: 100%"
    >
      <label
        v-for="typeName of reqBodyTypeNames"
        :key="typeName.name"
        class="d-flex align-items-center"
      >{{typeName.name}}
        <input
          :type="typeName.type"
          class="form-control"
          style="margin-left: 10px"
          v-model="reqData[typeName.name]"
        />
      </label>
      <label class="d-flex align-items-center">
        Book Type
        <select class="form-control" v-model='reqData.bookType'>
          <option disabled value=''>Please select one</option>
          <option value='normal'>Normal</option>
          <option value='coursebook'>Course Book</option>
          <option value='reference'>Reference</option>
        </select>
      </label>

      <label class="d-flex align-items-center">Writers
        <div
          v-for="(writer, index) in reqData.bookWriters"
          :key="writer"
          class="listEntity"
        >
          <p class="listText">{{writer}}</p>
          <button
            class="btn btn-danger listbtn"
            @click.prevent="removeWriter(index)"
          >
            X
          </button>
        </div>
        <div class="listEntity">
          <input
            type="text"
            class='form-control'
            @keypress.enter.prevent="addWriter"
            v-model="writerText"
          />
          <button
            class="btn btn-success listbtn"
            @click.prevent="addWriter"
          >
            +
          </button>
        </div>

      </label>

      <input
        @click.prevent='sendRequest'
        type='submit'
        class='btn btn-success form-control'
        value='Send!'
      >
    </form>
    <response-table
      v-if="resData"
      :resData="resData"
    />
  </div>
</template>

<script>
import ResponseTable from './ResponseTable.vue';

export default {
  name: 'CreateBookForm',
  components: { ResponseTable },
  data() {
    return {
      reqData: {
        bookWriters: [],
      },
      resData: undefined,
      reqBodyTypeNames: [
        { name: 'bookId', type: 'text' },
        { name: 'bookVolume', type: 'text' },
        { name: 'bookTitle', type: 'text' },
        { name: 'bookGenre', type: 'text' },
        { name: 'bookPageCount', type: 'number' },
        { name: 'bookPrice', type: 'number' },
        { name: 'publisherName', type: 'text' },
      ],
      writerText: '',
    };
  },
  methods: {
    removeWriter(index) {
      this.reqData.bookWriters.splice(index, 1);
    },
    addWriter() {
      if (this.writerText) {
        this.reqData.bookWriters.push(this.writerText);
        this.writerText = '';
      }
    },
    async sendRequest() {
      try {
        const thisPage = this;
        this.resData = (await this.$http({
          method: 'post',
          url: '/books',
          data: thisPage.reqData,
        })).data;
      } catch (err) {
        if (!err.response) {
          this.$notify({
            group: 'main',
            title: 'Request error',
            text: err.message,
            type: 'error',
          });
        } else {
          this.resData = err.response.data;
        }
      }
    },
  },
};
</script>

<style scoped>
  .reqWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
    box-shadow: 2px 4px 11px 5px rgba(0,0,0,0.54);
    margin: 20px auto;
    min-width: 75%;
    max-width: 75%;
    min-height: 75%;
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
