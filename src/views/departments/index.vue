<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">

        <tree-tools
          :tree-node="company"
          :is-root="true"
          @isAddShow="isAddShow"
        />

        <el-tree :data="departs" :props="defaultProps" default-expand-all node-key="id">
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @deleteDepartment="loadDepartment"
            @isAddShow="isAddShow"
            @editDept="editDept"
          />
        </el-tree>

      </el-card>

    </div>

    <!-- 弹出层 -->
    <add-dept
      ref="addDept"
      :add-dialog.sync="addDialog"
      :tree-node="node"
      @addDept="loadDepartment"
    />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartment } from '@/api/departments'
import { tranListToTreeDate } from '@/utils'
import AddDept from './components/add-dept.vue'

export default {
  name: 'DepartmentsIndex',
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {
        name: '',
        manager: '负责人',
        id: ''
      },
      departs: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      addDialog: false, // 新增弹出层
      node: null // 记录当前的点击节点
    }
  },
  created() {
    this.loadDepartment()
  },
  methods: {
    async loadDepartment() {
      const result = await getDepartment()
      console.log(result)
      this.company.name = result.companyName
      this.departs = tranListToTreeDate(result.depts, '')
    },
    isAddShow(treeNode) {
      this.node = treeNode
      this.addDialog = true
    },
    editDept(treeNode) {
      this.node = treeNode
      this.addDialog = true
      this.$refs.addDept.getDepartDetail(treeNode.id)
    }
  }
}
</script>

<style scoped lang="scss">
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
  .el-dropdown {
    cursor: pointer;
  }
}
</style>
