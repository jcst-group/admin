<template>
    <div class="temp">
        <div class="button">
            <i-button class="review-btn btn">
                <Icon type="md-sync" class="icon"/>
                重置
            </i-button>
            <i-button class="search-btn btn" style="margin-right:10px">
                <Icon type="md-search" class="icon"/>
                查询
            </i-button>
            <i-button class="add-btn btn" style="margin-right:10px">
                <Icon type="md-add" class="icon"/>
                新增
            </i-button>
            <i-button class="delete-btn btn" style="margin-right:10px">
                <Icon type="md-trash" class="icon"/>
                删除
            </i-button>
        </div>
        <div class="input">
            <span class="title">地区查询：</span>
            <i-input v-model="value" class="inp" />
        </div>
        <div class="dropdown">
            <Dropdown style="margin-top: 20px" trigger='click'>
                <Button type="primary">
                    下拉菜单
                    <Icon type="ios-arrow-down"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem>驴打滚</DropdownItem>
                    <DropdownItem>炸酱面</DropdownItem>
                    <DropdownItem>豆汁儿</DropdownItem>
                    <DropdownItem>冰糖葫芦</DropdownItem>
                    <DropdownItem>北京烤鸭</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>
</template>
<script>
export default {
    name: 'temp',
    data() {
        return {
            value: ''
        }
    }
}
</script>
<style lang='stylus' scoped>
    .btn
        float right
        background #2c909c
        border-color #2c909c
        color #fff
        line-height 18px
        .icon
            font-size 18px
            vertical-align middle
    .title
        margin-right 5px
        line-height 32px
    .inp
        width 20%
</style>
