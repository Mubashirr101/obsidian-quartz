import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"

ExternalPlugin.Explorer({
  filterFn: (node) => {
    const hidden = ["changelog-data", "assets", "tags"]
    const name = node.displayName?.toLowerCase() ?? ""
    return !hidden.includes(name)
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()