<template>
  <div class="dashboard-container">
    <div class="app-container">

      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height:60px">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <el-table border :data="list">
              <el-table-column label="序号" width="120" type="index" align="center" />
              <el-table-column label="角色名" width="240" prop="name" align="center" />
              <el-table-column label="描述" prop="description" align="center" />
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="assignPerm(scope.row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
                </template>

              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <el-pagination :total="total" :page-size="pagesize" :current-page="page" layout="prev, pager, next" @current-change="currentChange" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" :closable="false" />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input v-model="formDate.name" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formDate.companyAddress" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formDate.companyPhone" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formDate.mailbox" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formDate.remarks" style="width:400px" disabled />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

      </el-card>

    </div>
    <el-dialog title="编辑弹层" :visible="showDialog" @close="cancelFn">
      <el-form ref="roleForm" label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button size="small" @click="cancelFn">取消</el-button>
        <el-button size="small" type="primary" @click="isOK">确定</el-button>
      </el-row>
    </el-dialog>

    <el-dialog title="分配权限" :visible="permissionDialog" @close="permCancel">
      <!-- 权限是一棵树 -->
      <el-tree
        ref="tree"
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        show-checkbox
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="checkedPerm"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-button type="primary" size="small" @click="btnAssignPerm">确定</el-button>
        <el-button size="small" @click="permCancel">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeDate } from '@/utils'
import { assignPerm } from '@/api/setting'

export default {
  data() {
    return {
      list: [],
      page: 1,
      pagesize: 10,
      total: 0,
      formDate: {},
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      permissionDialog: false, // 分配权限dialog
      permData: [], // 接收权限数据
      defaultProps: {
        label: 'name'
      },
      roleId: null, // 记录当前分配权限的员工id
      checkedPerm: []
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const data = await getRoleList(
        {
          page: this.page,
          pagesize: this.pagesize
        }
      )
      this.list = data.rows
      this.total = data.total
    },
    currentChange(val) {
      this.page = val
      this.getRoleList()
    },
    async getCompanyInfo() {
      const data = await getCompanyInfo(this.companyId)
      this.formDate = data
   },
   async deleteRole(id) {
    try {
      await this.$confirm('确认删除该角色吗')
      await deleteRole(id)
      this.getRoleList()
      this.$message.success('删除角色成功')
    } catch (err) {
      console.log(err)
    }
   },
   // 编辑角色
   async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true // 显示弹层
   },
   // 关闭弹层
   cancelFn() {
    this.showDialog = false
    this.roleForm = {
      name: '',
      description: ''
    }
    this.$refs.roleForm.resetFields()
   },
   async isOK() {
    try {
      await this.$refs.roleForm.validate()
      if (this.roleForm.id) {
        await updateRole(this.roleForm)
        this.$message.success('修改成功')
      } else {
        await addRole(this.roleForm)
      this.$message.success('新增成功')
      }
      this.getRoleList()
      this.showDialog = false
    } catch (err) {
      console.log(err)
    }
   },
   // 分配权限
   async assignPerm(id) {
    this.permData = tranListToTreeDate(await getPermissionList(), '0')
    this.roleId = id
    const { permIds } = await getRoleDetail(id) // 获取权限数据
    this.checkedPerm = permIds
    this.permissionDialog = true
   },
    permCancel() {
      this.checkedPerm = []
      this.permissionDialog = false
    },
    async btnAssignPerm() {
      await assignPerm({
        id: this.roleId,
        permIds: this.$refs.tree.getCheckedKeys()
      })
      this.$message.success('分配权限成功')
      this.permissionDialog = false
    }
  }
}
</script>

<style>

</style>
