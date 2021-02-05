<template>
  <div class="reqWrapper">
    <p>Start borrow</p>
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

      <label class="d-flex align-items-center">Books
        <div
          v-for="(bookObj, index) in reqData.books"
          :key="bookObj.id"
          class="listEntity"
        >
          <p class="listText">{{bookObj.id}},{{bookObj.volume}}</p>
          <button
            class="btn btn-danger listbtn"
            @click.prevent="removeBook(index)"
          >
            X
          </button>
        </div>
        <div class="listEntity">
          <input
            type="text"
            class='form-control'
            placeholder="id"
            @keypress.enter.prevent="addBook"
            v-model="idText"
          />
          <input
            type="text"
            class='form-control'
            placeholder="volume"
            @keypress.enter.prevent="addBook"
            v-model="volText"
          />
          <button
            class="btn btn-success listbtn"
            @click.prevent="addBook"
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
  name: 'StartBorrowForm',
  components: { ResponseTable },
  data() {
    return {
      reqData: {
        books: [],
      },
      resData: undefined,
      reqBodyTypeNames: [
        { name: 'endDate', type: 'datetime-local' },
      ],
      idText: '',
      volText: '',
    };
  },
  methods: {
    removeBook(index) {
      this.reqData.books.splice(index, 1);
    },
    addBook() {
      if (this.idText && this.volText) {
        this.reqData.books.push({
          id: this.idText,
          volume: this.volText,
        });
        this.idText = '';
        this.volText = '';
      }
    },
    async sendRequest() {
      try {
        const thisPage = this;
        this.resData = (await this.$http({
          method: 'post',
          url: '/borrows',
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
