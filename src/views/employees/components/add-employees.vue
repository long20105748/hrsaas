<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <el-form ref="formData" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="obj in hireType" :key="obj.id" :label="obj.value" :value="obj.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartment" />
        <!-- 放置树形控件 -->
        <el-tree v-if="treeData.length" v-loading="loading" :data="treeData" :props="{ label: 'name'}" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row type="flex" justify="center">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="addEmployee">确定</el-button>
      </el-row>
    </template>

  </el-dialog>
</template>

<script>
import { getDepartment } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { tranListToTreeDate } from '@/utils'
import EmployeesEnum from '@/api/constant/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hireType: EmployeesEnum.hireType,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: 1,
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { max: 5, min: 2, message: '姓名为2-5位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号不合法', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'change' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      treeData: [],
      loading: false
    }
  },
  methods: {
    async addEmployee() {
      try {
        await this.$refs.formData.validate()
        await addEmployee(this.formData)
        this.$message.success('新增成功')
        this.$parent.getEmployeeList()
        this.$parent.showDialog = false
      } catch (err) {
        console.log(err)
      }
    },
    btnCancel() {
      this.$emit('update:showDialog', false)
      this.$refs.formData.resetFields()
    },
    async getDepartment() {
      this.loading = true
      const { depts } = await getDepartment()
      this.treeData = tranListToTreeDate(depts, '')
      this.loading = false
    },
    selectNode(node) {
      this.formData.departmentName = node.name
      this.treeData = []
    }
  }
}
</script>

<style>

</style>
