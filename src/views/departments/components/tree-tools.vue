<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 菜单内容 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { deleteDepartmentById } from '@/api/departments'

export default {
  name: 'TreeTools',
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'add') {
        this.$emit('isAddShow', this.treeNode)
        //  addDepartment({})
      } else if (command === 'edit') {
        this.$emit('editDept', this.treeNode)
      } else if (command === 'delete') {
          this.$confirm('您确定要删除该组织部门吗').then(() => {
            return deleteDepartmentById(this.treeNode.id)
          }).then(() => {
            this.$emit('deleteDepartment', this.treeNode.id)
            this.$message.success('删除部门成功')
          })
      }
    }
  }
}
</script>

<style>

</style>
