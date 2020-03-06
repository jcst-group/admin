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
        v-if="datas.length !== 0"
        checkable
        :defaultCheckedKeys ='htDefaultCheckedDatas'
        :treeData="datas"
        @check='checkHTResource'
      />
      <div v-else style="font-size:18px; font-weight:1000">暂无权限</div>
    </a-modal>
  </div>
</template>
<script>
  import {roleResource,roleResourceUpdate} from '@/api/permissonApi'
  // import {allmenus} from '@/api/allapi'
  // import {pick} from 'lodash'


  export default {
    data() {
      return {
        record:{},
        datas:[],
        htDefaultCheckedDatas: [],
        visible: false,
        title:"",
        htAllDatas: [],
        lock: true
      }
    },
    methods: {
      _getResource() {
        roleResource().then(res => {
          if (res.success) {
            this.datas = this.filterNoChild(res.result, 'ht')
            if (this.record.resourceList.length > 0) {
              for (let i = 0; i < this.record.resourceList.length; i++) {
                let id = this.record.resourceList[i].id
                for (let j = 0; j < this.htAllDatas.length; j++) {
                  if (id === this.htAllDatas[j].id) {
                    this.htDefaultCheckedDatas.push(id)
                  }
                }
              }
            }
          }
        })
      },
      _dataInit() {
        this.datas = []
        this.htDefaultCheckedDatas = []
        this.htAllDatas = []
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
          resourceList: []
        }
        if (this.htDefaultCheckedDatas.length > 0) {
          for (let i = 0; i < this.htDefaultCheckedDatas.length; i++) {
            params.resourceList.push({
              id: this.htDefaultCheckedDatas[i]
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
      checkHTResource(key, e) {
        this.lock = false
        // this.htDefaultCheckedDatas = key.checked
        this.htDefaultCheckedDatas = []
        if (e.halfCheckedKeys.length > 0) {
          this.htDefaultCheckedDatas = e.halfCheckedKeys
        }
        this.htDefaultCheckedDatas = this.htDefaultCheckedDatas.concat(key)
      }
    }
  }
</script>
<style lang="stylus">
  .resource-modal
    .ant-modal-body
      padding-top 10px
</style>
