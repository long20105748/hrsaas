<template>
  <!-- el弹出层 -->
  <el-dialog
    :visible="addDialog"
    :title="showTitle"
    @close="btnCancel"
  >
    <!-- 新增表单 -->
    <!-- label-width设置label宽度 -->
    <el-form ref="deptForm" label-width="120px" :model="dept" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="dept.name" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="dept.code" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="dept.manager" style="width: 80%" placeholder="请选择" @focus="getEmployeesSimple">
          <el-option v-for="people in peoples" :key="people.id" :label="people.username" :value="people.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="dept.introduce" style="width: 80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 确认 -->
    <template #footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="addDepartment">确认</el-button>
        </el-col>
      </el-row>
    </template>

  </el-dialog>
</template>

<script>
import { getDepartment, addDepartment, getDepartDetail, editDepartment } from '@/api/departments'
import { getEmployeesSimple } from '@/api/employees'

export default {
  name: 'AddDept',
  props: {
    addDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartment()
      let isRepeat = false
      if (this.dept.id) {
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`${value}已存在`)) : callback()
    }
    // 检查编码是否重复
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartment()
      let isRepeat = false
      if (this.dept.id) {
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }
        isRepeat ? callback(new Error(`${value}编码重复`)) : callback()
    }
    return {
      dept: {
        code: '',	// 部门编码，同级部门不可重复
        introduce: '',	// 介绍
        manager: '', //	负责人名称
        name: ''	// 部门名称
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { max: 50, message: '部门名称应小于50个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { max: 300, message: '部门介绍应小于300个字符', trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { max: 50, message: '部门编码应小于50个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.dept.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
      async getEmployeesSimple() {
        this.peoples = await getEmployeesSimple()
      },
      addDepartment() {
        this.$refs.deptForm.validate(async valid => {
          if (valid) {
            if (this.dept.id) {
              await editDepartment(this.dept)
               this.$message.success('修改成功')
            } else {
               await addDepartment({ ...this.dept, pid: this.treeNode.id })
                this.$message.success('新增成功')
            }
            // 重新渲染列表
            this.$emit('addDept')
            // 关闭弹层
            this.$emit('update:addDialog', false)
          }
        })
      },
      btnCancel() {
        this.dept = {
          code: '',	// 部门编码，同级部门不可重复
          introduce: '',	// 介绍
          manager: '', //	负责人名称
          name: ''	// 部门名称
        }
        this.$emit('update:addDialog', false)
        this.$refs.deptForm.resetFields()
      },
      // 获取部门详情
      async getDepartDetail(id) {
        this.dept = await getDepartDetail(id)
      }
  }
}
</script>

<style>

</style>
