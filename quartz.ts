import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"

const hiddenFromExplorer = ["changelog-data", "assets", "tags"]

ExternalPlugin.Explorer({
  filterFn: (node) => {
    const name = node.displayName?.toLowerCase() ?? ""
    return !hiddenFromExplorer.includes(name)
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()