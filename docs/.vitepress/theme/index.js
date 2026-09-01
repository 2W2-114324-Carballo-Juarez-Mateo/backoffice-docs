import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import SddDropdown from './components/SddDropdown.vue'
import InteractiveButton from './components/InteractiveButton.vue'
import FlowPlayer from './components/FlowPlayer.vue'
import ScenarioPage from './components/ScenarioPage.vue'
import './styles.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'nav-bar-content-after': () => h('div', { class: 'header-custom-actions' }, [
      h(InteractiveButton),
      h(SddDropdown)
    ])
  }),
  enhanceApp({ app }) {
    app.component('FlowPlayer', FlowPlayer)
    app.component('ScenarioPage', ScenarioPage)
  }
}