<template>
    <div>
        <a-modal
            title="角色分配"
            :visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
            :maskClosable="false"
        >
            <a-checkbox-group :options="Options" v-model="value"/>
        </a-modal>
    </div>
</template>
<script>
import { getallpermission, adduserrole, selrole } from "@/api/allapi";
export default {
    data() {
        return {
            visible: false,
            id: "",
            Options: [],
            value: []
        };
    },  
    methods: {
        handleOk() {
        //console.log(this.value);
            let par = {};
            par.uid = this.id;
            par.roleList = [];
            for (let i = 0; i < this.value.length; i++) {
                let a = {};
                a.id = this.value[i];
                par.roleList.push(a);
            }
            adduserrole(par).then(res => {
                this.value = []
                if (res.success) {
                    this.$parent.loadData();
                    this.$message.info(res.message);
                    this.visible = false;
                } else {
                    this.$message.error(res.message);
                    this.visible = false;
                }
            });
        },
        handleCancel() {
            this.visible = false;
            this.value = []
        },
        add(record) {
            this.id = record.uid;
            getallpermission().then(res => {
                //console.log(res);
                if (res.success) {
                    this.Options = [];
                    for (let i = 0; i < res.result.length; i++) {
                        let a = {};
                        a.label = res.result[i].name;
                        a.value = String(res.result[i].id);
                        this.Options.push(a);
                    }
                    if (record.roleList && record.roleList.length > 0) {
                        for (let i = 0; i < record.roleList.length; i++) {
                            this.value.push(String(record.roleList[i].id))
                        }
                    }
                    // selrole({ uid: this.id }).then(res => {
                    //     console.log(res)
                    //     this.value = [];
                    //     if (res.result.length > 0) {
                    //         for (let i = 0; i < res.result.length; i++) {
                    //             this.value.push(String(res.result[i].id));
                    //         }
                    //     }
                    // });
                }
            });
            this.visible = true;
        }
    }
};
</script>
<style scoped>
</style>

