import { createApp } from 'vue'
import App from './App.vue'
import './main.css'

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { TreeDataModule } from 'ag-grid-enterprise'

ModuleRegistry.registerModules([AllCommunityModule, TreeDataModule])

createApp(App).mount('#app')
