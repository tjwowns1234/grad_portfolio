<template>
<div id="app">
    <!-- <b-navbar toggleable="md" type="dark" variant="dark" class="mnav">
        <b-navbar-brand v-on:click="go('/')"><img class="iimg" src="./assets/logo.png"><strong>Hi~! 경주</strong></b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-nav-item class="list ml-auto" v-on:click="go('/analyze')">통계</b-nav-item>
            <b-nav-item class="list" href='#'>관광지</b-nav-item>
            <b-nav-item class="list" href='#'>숙박시설</b-nav-item>
            <b-nav-item class="list" href='#'>내 주변은?</b-nav-item>
        </b-collapse>
    </b-navbar> -->

    <router-view></router-view>

</div>
</template>

<script>
export default {
    name: 'app',
    methods: {
        go: function (targetName) {
            this.$router.push(targetName);
        }
    }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap");
body{
    font-family: 'Noto Sans KR', sans-serif;
}
body::-webkit-scrollbar {
    display: none;
}
#app {
    
    text-align: center;
    list-style: none;
    /* font-family: "Malgun Gothic"; */
}

.iimg {
    width: 28px;
    height: 26px;
    margin-right: 10px;
}

.list{
  font-weight: bold;
}
</style>
