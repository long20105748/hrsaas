<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ total }}条记录</span>
        <template #after>
          <el-button type="success" size="small" @click="$router.push('/import')">excel导入</el-button>
          <el-button type="danger" size="small" @click="exportData">excel导出</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template v-slot="scope">
            {{ scope.row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="" prop="enableState" :formatter="formatWorkingState">
          <template v-slot="{ row }">
            <el-switch
              :value="row.enableState === 1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280px">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination layout="prev, pager, next, jumper" :total="total" :page-size="size" :current-page="page" @current-change="currentChange" />
      </el-row>
    </div>

    <add-employees :show-dialog.sync="showDialog" />

  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeesEnum from '@/api/constant/employees' // 引入员工枚举对象
import AddEmployees from './components/add-employees.vue'
import { formatDate } from '@/filters'

export default {
  components: {
    AddEmployees
  },
  data() {
    return {
      list: [],
      page: 1,
      size: 5,
      total: 0,
      loading: false,
      showDialog: false // 显示弹层
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      try {
        const { rows, total } = await getEmployeeList({
          page: this.page,
          size: this.size
        })

        // 判断当页是否还有数据
        if (this.page > 1 && !rows.length) {
          this.page--
          this.getEmployeeList()
        }

        this.total = total
        this.list = rows
      } catch (err) {
        console.log(err)
      }
       this.loading = false
    },
    currentChange(val) {
      this.page = val
      this.getEmployeeList()
    },
    formatEmployment(row, column, cellValue, index) {
      const found = EmployeesEnum.hireType.find(item => item.id === cellValue)
      return found ? found.value : '未知'
    },
    formatWorkingState(row, column, cellValue, index) {
      const found = EmployeesEnum.workingState.find(item => item.id === cellValue)
      return found ? found.value : '未知'
    },
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除')
        await delEmployee(id)
        this.$message.success('删除成功')
        this.getEmployeeList()
      } catch (err) {
        console.log(err)
      }
    },
    // 导出
    exportData() {
      const header = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
      //   // excel是引入文件的导出对象
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.total
      })
      const multiHeader = [['姓名', '基本信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const data = this.formatJson(header, rows)
        excel.export_json_to_excel({
          header: Object.keys(header),
          data,
          filename: '员工列表' + Date.now(),
          multiHeader,
          merges
        })
      })
    },
    formatJson(header, rows) {
      return rows.map(item => {
        return Object.keys(header).map(key => {
          if (header[key] === 'timeOfEntry' || header[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[header[key]])
          } else if (header[key] === 'formOfEmployment') {
            const obj = EmployeesEnum.hireType.find(obj => obj.id === item[header[key]])
            return obj ? obj.value : '未知'
          }
          return item[header[key]]
        })
      })
    }
  }
}
</script>

<style>

</style>
