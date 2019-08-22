import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../components/home'
import analyze from '../components/analyze'

Vue.use(VueRouter)


export const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/analyze',
            name: 'analyze',
            component: analyze
        }
    ]
})
