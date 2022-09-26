<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :limit="1"
      :on-preview="preview"
      :on-remove="remove"
      :on-change="change"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{ disabled: flieComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showProgress" :percentage="percent" style="width: 180px" />
    <el-dialog :visible.sync="dialogVisible" title="图片预览">
      <img :src="imgUrl" alt="" width="100%">
    </el-dialog>
  </div>

</template>

<script>
// 引入腾讯云cos包
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDEVej3kpOXhC7BDF8vcnqcXwm3OMT9bMz',
  SecretKey: 'cwWRNK9EF26HTXY98osuJxtn4G4M23CO'
})

export default {
  data() {
    return {
      percent: 0,
      showProgress: false,
      imgUrl: '',
      dialogVisible: false,
      currentFileUid: null, // 记录当前正在上传的uid
      fileList: []
    }
  },
  computed: {
    flieComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      this.imgUrl = file.url
      this.dialogVisible = true
    },
    remove(file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // this.fileList = fileList
    },
    change(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      // 检查图片格式
       const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
       if (!types.some(item => item === file.type)) {
          this.$message.error('图片格式不正确')
          return false
       }
       // 检查图片大小
       const maxSize = 5 * 1024 * 1024
       if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
       }
       this.currentFileUid = file.uid
       this.showProgress = true
       return true
    },
    upload(params) {
      if (params.file) {
        cos.putObject({
          Bucket: 'hoyoung-1314098344',
          Region: 'ap-shanghai',
          Key: params.file.name,
          StorageClass: 'STANDARD',
          Body: params.file,
          onProgress: (progressData) => {
            console.log(JSON.stringify(progressData))
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          console.log(err || data)
          if (!err && data.statusCode === 200) {
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
                // upload: true表示图片上传成功
              }
              return item
            })
            setTimeout(() => {
              this.showProgress = false
              this.percent = 0
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .disabled {
    &::v-deep .el-upload--picture-card {
      display: none;
    }
  }
</style>
