<template>
    <div>
        <div class="menu_top">
            <div class="menu">
                <a-menu v-model="current" mode="horizontal">
                    <a-menu-item key="mail">One </a-menu-item>
                    <a-menu-item key="app">Two </a-menu-item>
                    <a-menu-item key="mail1">One1 </a-menu-item>
                    <a-menu-item key="mail2">One2 </a-menu-item>
                    <a-menu-item key="mail3">One3 </a-menu-item>
                    <a-menu-item key="mail4">One4 </a-menu-item>
                    <a-menu-item key="alipay">Four</a-menu-item>
                    </a-menu>
            </div>
        </div>
        <div class="lunbo">
            <a-carousel autoplay>
                <div><h3>1</h3></div>
                <div><h3>2</h3></div>
                <div><h3>3</h3></div>
                <div><h3>4</h3></div>
            </a-carousel>
        </div>
        <div class="list">
             <a-list itemLayout="horizontal" :dataSource="data">
                <a-list-item slot="renderItem" slot-scope="item">
                <a-list-item-meta
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                >
                    <a slot="title" href="https://vue.ant.design/">{{item.title}}</a>
                    <a-avatar
                    slot="avatar"
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    />
                </a-list-item-meta>
                </a-list-item>
            </a-list>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            current:['mail'],
            data:[
                {
                title: 'Ant Design Title 1',
                },
                {
                title: 'Ant Design Title 2',
                },
                {
                title: 'Ant Design Title 3',
                },
                {
                title: 'Ant Design Title 4',
                },
            ]
        }
    }
}
</script>
<style scoped>
.menu_top{
    width:100%;
    height:48px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
}
.menu{
    width:900px;
    min-width: 875px;
    margin:0 auto;
}
.lunbo{
    width:600px;
    margin:20px auto;
}
.list{
    width:875px;
    margin:0 auto;
}
.ant-carousel >>> .slick-slide {
    text-align: center;
    height: 160px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
}

.ant-carousel >>> .slick-slide h3 {
    color: #fff;
}
</style>