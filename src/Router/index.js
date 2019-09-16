import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../components/home'

Vue.use(VueRouter)

export const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        }
    ],
})
