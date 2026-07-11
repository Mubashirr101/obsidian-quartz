import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"

const hiddenFromExplorer = ["changelog-data", "assets", "tags"]

ExternalPlugin.Explorer({
  filterFn: (node) => !hiddenFromExplorer.includes(node.displayName.toLowerCase()),
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()