<template>
  <div>
    <a-modal
      v-model="visible"
      :title="title"
      @ok="handleOk"
      @cancel="handelCancel"
      okText="保存"
      cancelText="取消"
      :maskClosable="false"
      style="position: relative; top: 5%"
      class="resource-modal"
    >
      <a-tree
        v-if="appDatas.length !== 0"
        checkable
        :defaultCheckedKeys ='appDefaultCheckedDatas'
        :treeData="appDatas"
        @check='checkAPPResource'
      />
      <div v-else style="font-size:18px; font-weight:1000">暂无权限</div>
    </a-modal>
  </div>
</template>
<script>
  import {roleResourceUpdate, appResource} from '@/api/permissonApi'
  // import {allmenus} from '@/api/allapi'
  // import {pick} from 'lodash'


  export default {
    data() {
      return {
        record:{},
        appDatas: [],
        appDefaultCheckedDatas: [],
        visible: false,
        title:"",
        appAllDatas: [],
        lock: true
      }
    },
    methods: {
      _getResource() {
        appResource().then(res => {
          if (res.success) {
            this.appDatas = this.filterNoChild(res.result, 'app')
            if (this.record.appResourceList.length > 0) {
              for (let i = 0; i < this.record.appResourceList.length; i++) {
                let id = this.record.appResourceList[i].id
                for (let j = 0; j < this.appAllDatas.length; j++) {
                  if (id === this.appAllDatas[j].id) {
                    this.appDefaultCheckedDatas.push(id)
                  }
                }
              }
            }
          }
        })
      },
      _dataInit() {
        this.appDatas = []
        this.appDefaultCheckedDatas = []
        this.appAllDatas = []
      },
      edit(record){
        this.lock = true
        this.record = record;
        this.visible = true;
        this._getResource()
      },
      filterNoChild(data, key){
        if(data instanceof  Array){
          for(let o in data){
            let obj = data[o]
            obj.title = obj.name;
            obj.key = obj.id;
            if(obj.children!=undefined && obj.children.length==0){
              this[key + 'AllDatas'].push(obj)
              delete obj.children;
            }else{
              this.filterNoChild(obj, key);
            }
          }
        }else if(data instanceof Object){
          data.title = data.name;
          data.key = data.id;
          if(data.children!=undefined && data.children.length==0){
            delete data.children;
          }else{
            this.filterNoChild(data.children, key);
          }
        }
        return data
      },
      handleOk() {
        if (this.lock) {
            this.$message.info('分配权限成功')
            this.visible = false
            return
        }
        let params = {
          id: this.record.id,
          appResourceList: []
        }
        if (this.appDefaultCheckedDatas.length > 0) {
          for (let i = 0; i < this.appDefaultCheckedDatas.length; i++) {
            params.appResourceList.push({
              id: this.appDefaultCheckedDatas[i]
            })
          }
        }
        roleResourceUpdate(params).then(res => {
          this.$message.info(res.message)
          if (res.success) {
            this.$parent.loadData()
          }
          this.visible = false
          setTimeout(() => {
            this._dataInit()
          }, 100)
        })
      },
      handelCancel() {
        setTimeout(() => {
          this._dataInit()
        }, 100)
      },
      checkAPPResource(key, e) {
        this.lock = false
        // this.appDefaultCheckedDatas = key.checked
        this.appDefaultCheckedDatas = []
        if (e.halfCheckedKeys.length > 0) {
          this.appDefaultCheckedDatas = e.halfCheckedKeys
        }
        this.appDefaultCheckedDatas = this.appDefaultCheckedDatas.concat(key)
      }
    }
  }
</script>
<style lang="stylus">
  .resource-modal
    .ant-modal-body
      padding-top 10px
</style>
