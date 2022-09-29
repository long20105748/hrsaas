<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="checkedList">
      <el-checkbox v-for="obj in checkboxList" :key="obj.id" :label="obj.id">{{ obj.name }}</el-checkbox>
    </el-checkbox-group>

    <el-row slot="footer" type="flex" justify="center">
      <el-button type="primary" size="small" @click="assignRoles">确定</el-button>
      <el-button size="small" @click="btnCancel">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: [String, Number, Object],
      default: null
    }
  },
  data() {
    return {
      checkboxList: [],
      checkedList: ['总裁办']
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList()
      this.checkboxList = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      if (roleIds) {
        this.checkedList = roleIds
      }
    },
    async assignRoles() {
      await assignRoles({
        id: this.userId,
        permIds: this.checkedList
      })
      this.$message.success('修改成功')
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.$emit('update:showRoleDialog', false)
      this.checkedList = []
    }
  }
}
</script>

<style>

</style>
