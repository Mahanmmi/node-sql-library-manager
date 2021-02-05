<template>
  <div class="answerContainer">
    <p
      v-if="typeof resData == 'string'"
      style="margin: 0"
    >
      {{resData}}</p>
    <b-table
      v-else
      striped
      hover
      :sticky-header="true"
      table-variant="dark"
      :fields="resNames"
      :items="tableItems"
    />
  </div>
</template>

<script>
export default {
  name: 'ResponseTable',
  props: {
    resData: [String, Object],
    resNames: Array,
  },
  computed: {
    tableItems() {
      console.log(this.resData);
      const items = [];
      this.resData.rows.forEach((rawItem) => {
        const rawItemStr = rawItem[Object.keys(rawItem)[0]];
        const rawItemTrimmed = rawItemStr.substring(1, rawItemStr.length - 1);
        console.log(rawItemTrimmed);
        const rawArray = rawItemTrimmed.split(',');
        const item = {};
        rawArray.forEach((val, colNum) => {
          item[this.resNames[colNum]] = val;
        });
        items.push(item);
      });
      return items;
    },
  },
};
</script>

<style scoped>
  .answerContainer {
    border-radius: 10px;
    margin: 15px 0;
    padding: 20px;
    text-align: left;
    background-color: #AAAAAA;
    width: 100%;
  }
</style>
