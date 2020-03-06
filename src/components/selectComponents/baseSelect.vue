<template>
    <div class="select-wrapper">
        <a-select
            v-if="isedit"
            @change="handleChange"
            @search='searchBase'
            @focus='focusSelect'
            @inputKeydown='getNewBase'
            :filterOption="false"
            :showSearch='true'
            :notFoundContent="fetching ? undefined : '无匹配数据'"
            :value='selectValue'>
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <a-select-option v-for="v in bases" :key="v.id" :value="v.id">{{v.baseName}}</a-select-option>
        </a-select>
        <template v-if="!isedit">{{curBase}}</template>
    </div>
</template>
<script>
import {queryAllBase} from '@/api/allapi'

export default {
    props: {
        record: {
            type: Object,
            default() {
                return {}
            }
        },
        isedit: {
            type: Boolean,
            default: true
        },
        value: {
            type: Object,
            default() {
                return {}
            }
        },
        middleValue: {
            default() {
                return ''
            }
        },
        hasAll: {
            type: Boolean,
            default: false
        }
    },
    data() {
        const value = this.value || {};
        return {
            selectValue: value.value || '',
            bases: [],
            fetching: false,
            curValue: '',
            timer: ''
        }
    },
    watch: {
        value (val = {}) {
            this.selectValue = val.value || this.middleValue
        },
    },
    computed: {
        curBase() {
            let base = ''
            if (this.bases.length > 0) {
                this.bases.forEach(item => {
                    if (item.id === this.record.baseId) {
                        base = item.baseName
                    }
                })
            }
            return base
        },
    },
    created() {
        this._loadData()
    },
    methods: {
        handleChange(value, option) {
            this.selectValue = value
            this.$emit('handleChange', value)
            this.triggerChange({value})
        },
        _loadData() {
            this.bases = []
            queryAllBase().then((res)=>{
                if(res.success){
                    if (this.hasAll) {
                        this.bases.push({
                            id: -1,
                            baseName: '全部'
                        })
                        this.bases = this.bases.concat(res.result)
                        return
                    }
                    this.bases = res.result;
                } else {
                    this.$message.info(res.message)
                }
            })
        },
        focusSelect() {
            this._loadData()
        },
        searchBase(value) {
            this.curValue = value
        },
        getNewBase() {
            this.bases = []
            this.fetching = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                queryAllBase({
                    baseName: this.curValue
                }).then((res)=>{
                    this.fetching = false
                    if(res.success){
                        this.bases = res.result
                    } else {
                        this.$message.info(res.message)
                    }
                })
            }, 800)    
        },
        triggerChange(changedValue) {
            this.$emit('change', Object.assign({}, this.$data.selectValue, changedValue));
        },
    }
}
</script>
<style lang="stylus" scoped>
    .select-wrapper
        display inline-block
        width 100%
</style>