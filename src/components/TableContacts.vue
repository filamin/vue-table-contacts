<template>
  <v-container>
    <tree-table class="table" :table-data="tableData" :columns="columns">
      <template #headerTemplate="headerProps">
        <TableHeader v-bind="headerProps" :sort-table="sortTable" />
      </template>
      <template #nodeTemplate="nodeProps">
        <TableNode v-bind="nodeProps" />
      </template>
    </tree-table>
  </v-container>
</template>

<script>
import TreeTable from "vue-tree-table-component";

import TableNode from "./TableNode";
import TableHeader from "./TableHeader";
import columns from "../resources/columns";
import sortData from "../utils/sortData";

export default {
  name: "TableContacts",
  components: { TreeTable, TableNode, TableHeader },
  props: {
    contacts: {
      type: Array,
    },
  },

  data: function () {
    return {
      columns: columns,
      tableData: this.contacts,
    };
  },
  methods: {
    sortTable(params) {
      sortData(this.tableData, params);
    },
  },
};
</script>
