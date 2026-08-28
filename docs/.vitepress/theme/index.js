import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import SddDropdown from './components/SddDropdown.vue'
import './styles.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'nav-bar-content-after': () => h(SddDropdown)
  })
}