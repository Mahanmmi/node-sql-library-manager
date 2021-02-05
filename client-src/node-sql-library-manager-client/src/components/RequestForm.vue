<template>
  <div class="reqWrapper">
    <p>{{reqName}}</p>
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
      <label
        v-for="param of reqParams"
        :key="param"
        class="d-flex align-items-center"
      >{{param}}
        <input
          :type="text"
          class="form-control"
          style="margin-left: 10px"
          v-model="reqParamData[param]"
        />
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
      :resNames="resNames"
    />
  </div>
</template>

<script>
import ResponseTable from './ResponseTable.vue';

export default {
  name: 'RequestForm',
  components: { ResponseTable },
  data() {
    return {
      reqData: {},
      reqParamData: {},
      resData: undefined,
    };
  },
  props: {
    reqName: String,
    reqMethod: String,
    reqURL: String,
    reqBodyTypeNames: Array,
    reqParams: Array,
    resNames: Array,
  },
  methods: {
    async sendRequest() {
      try {
        const thisPage = this;
        this.resData = (await this.$http({
          method: thisPage.reqMethod,
          url: thisPage.reqURL,
          data: thisPage.reqData,
          params: thisPage.reqParamData,
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
</style>
